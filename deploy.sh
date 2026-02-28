#!/bin/bash
# 部署到 GitHub Pages

npm run build
cd dist

git init
git add .
git commit -m "deploy: $(date)"

# 推送到 gh-pages 分支
git push -f https://github.com/YOUR_USERNAME/bnuz-feed.git main:gh-pages

cd -
echo "✅ 部署完成！访问 https://YOUR_USERNAME.github.io/bnuz-feed/"
