const chartFiles = import.meta.globEager('./charts/**/*.js');
const chartsObj = {};
for (const chartPath in chartFiles) {
  chartsObj[chartPath.replace(/(\.\/charts\/|\.js)/g, '')] = chartFiles[chartPath].default;
}

export default chartsObj;
