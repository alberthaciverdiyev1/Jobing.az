const jsModules = import.meta.glob('./js/**/**/*.js');

Object.keys(jsModules).forEach((modulePath) => {
    jsModules[modulePath]().then((module) => {
        console.log(`JS Module loaded: ${modulePath}`);
    });
});

const cssModules = import.meta.glob('./css/**/**/*.css');

Object.keys(cssModules).forEach((modulePath) => {
    cssModules[modulePath]().then(() => {
        console.log(`CSS Module loaded: ${modulePath}`);
    });
});


