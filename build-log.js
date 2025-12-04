import fs from 'fs';
import { exec } from 'child_process';
// 封装命令
function execute(command) {
  return new Promise(resolve => {
    exec(command, function (err, stdout) {
      if (err != null) {
        resolve(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function start() {
  // 执行npm打包命令
  console.log('开始打包...');
  // 获取当前git分支名称
  const branchName = await execute('git rev-parse --abbrev-ref HEAD');
  // 执行git log命令 查看当前分支提交历史
  const _history = await execute('git log -1 --pretty="short"');
  // 日志拼接
  let newStr = '打包日期：' + new Date().toLocaleString() + '\n分支名称：' + branchName + '\n' + _history;
  // 将日志写入log.txt
  fs.writeFile('dist/log.txt', newStr, 'utf-8', function (err) {
    if (err != null) {
      console.log('ERROR:', err);
    } else {
      console.log('打包完成');
    }
  });
}

// 执行任务
start();
