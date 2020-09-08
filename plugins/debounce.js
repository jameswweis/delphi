const debounce = function(fn, timeout, runOnStart = false) {
  let timer;
  let locked;
  return function() {
    let args = arguments;
    let context = this;

    clearTimeout(timer);
    if (runOnStart) {
      if (!locked) {
        locked = true;
        fn.apply(context, args);
      }
      timer = setTimeout(function() {
        locked = false;
      }, timeout);
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, timeout);
    }
  };
};

export default debounce;
