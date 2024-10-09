#!/bin/bash

# 檢查是否有傳入環境變數檔案名稱
if [ -n "$1" ]; then
    ENV_FILE="$1"
else
    ENV_FILE=".env.deploy"
fi

# 載入環境變數檔案中的變數
if [ -f "${ENV_FILE}" ]; then
    export $(grep -v '^#' "${ENV_FILE}" | xargs)
fi

# 確保必要的變數已經定義
for var in REMOTE_DIR SSH_USER_HOST PM2_PROCESS_NAME BUILD_COMMAND; do
    if [ -z "${!var}" ]; then
        echo "錯誤：未定義 $var 變數。"
        exit 1
    fi
done

# 先切換到 main 分支
if ! git checkout main; then
    echo "git checkout mian 失敗！"
    exit 1  # 若 git checkout main 失敗，退出腳本並返回錯誤碼
fi

# 拉最新的 code
if ! git pull; then
    echo "git pull 失敗！"
    exit 1  # 若 git pull 失敗，退出腳本並返回錯誤碼
fi

# 刪除舊的 .next 資料夾並建置新的
echo "刪除舊的 .next 資料夾..."
rm -rf .next

echo "開始建置新的 .next 資料夾..."
if ! npm install; then
    echo "npm install 失敗！"
    exit 1
fi

# 從環境變數中讀取 BUILD_COMMAND 並解碼 BUILD_COMMAND
decoded_build_command=$(printf '%b' "${BUILD_COMMAND//%/\\x}")
echo "執行建置命令: $decoded_build_command"
if ! eval $decoded_build_command; then
    echo "建置失敗！"
    exit 1
fi

# 先連到主機，將舊的 tmp 資料夾清空
ssh "${SSH_USER_HOST}" << EOF
echo "進入遠端 ${REMOTE_DIR} 資料夾..."
cd "${REMOTE_DIR}"

echo "清空舊的 tmp 資料夾..."
rm -rf tmp

echo "創建新的 tmp 資料夾..."
mkdir tmp
EOF

# 使用 SCP 上傳 .next 壓縮檔，先上傳到 tmp 資料夾待命，上傳完成後，刪除壓縮檔
echo "上傳 .next 壓縮檔到遠端主機..."
tar -czf .next.tar.gz .next
scp .next.tar.gz "${SSH_USER_HOST}:${REMOTE_DIR}/tmp"
rm -rf .next.tar.gz

# 上傳完成後，執行遠端命令
ssh "${SSH_USER_HOST}" << EOF
echo "進入遠端 ${REMOTE_DIR} 資料夾..."
cd "${REMOTE_DIR}"

echo "git pull..."
if ! git pull; then
    echo "git pull 失敗！"
    exit 1  # 若 git pull 失敗，退出腳本並返回錯誤碼
fi

echo "npm install"
npm install

if [ -f "tmp/.next.tar.gz" ]; then
    echo "找到新的 .next.tar.gz，準備解壓縮..."
    rm -rf tmp/.next  # 刪除舊的 tmp/.next 資料夾
    tar --warning=no-unknown-keyword -xzf tmp/.next.tar.gz -C tmp  # .next 解壓縮到 tmp 資料夾
else
    echo "找不到 tmp/.next.tar.gz，請檢查上傳是否成功。"
    exit 1
fi

echo "將舊的 .next 資料夾刪除，並將 tmp/.next 移動到 ${REMOTE_DIR} ..."
rm -rf .next
mv tmp/.next .

echo "pm2 restart..."
pm2 restart "${PM2_PROCESS_NAME}"
EOF

echo "部署完成！"