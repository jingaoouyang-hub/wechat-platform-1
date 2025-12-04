import * as antIcon from '@ant-design/icons-vue';

export const antIconNames = () => {
  const iconNames: string[] = [];

  for (const antIconKey in antIcon) {
    iconNames.push(antIconKey);
  }
  return iconNames;
};

export const antIconNamesOutLined = () => {
  const iconNames: string[] = [];

  for (const antIconKey in antIcon) {
    if (antIconKey.lastIndexOf('Outlined') !== -1) {
      iconNames.push(antIconKey);
    }
  }
  return iconNames;
};

export const antIconNamesFilled = () => {
  const iconNames: string[] = [];
  for (const antIconKey in antIcon) {
    if (antIconKey.lastIndexOf('Filled') !== -1) {
      iconNames.push(antIconKey);
    }
  }
  return iconNames;
};

export const antIconNamesTwoTone = () => {
  const iconNames: string[] = [];
  for (const antIconKey in antIcon) {
    if (antIconKey.lastIndexOf('TwoTone') !== -1) {
      iconNames.push(antIconKey);
    }
  }
  return iconNames;
};

export * from '@ant-design/icons-vue';
