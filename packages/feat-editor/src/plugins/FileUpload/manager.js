class UploadManager {
  constructor() {
    this.key = 1;
    this.taskTypeKey = 1;
    this.data = {};
    this.events = {};
    this.taskCreators = {};
  }
  getTaskCreator = key => this.taskCreators[key];
  registerTaskCreator = (fn) => {
    const taskTypeKey = this.taskTypeKey;
    this.taskCreators[taskTypeKey] = fn;
    this.taskTypeKey = taskTypeKey + 1;
    return taskTypeKey;
  };
  subscribe(key, func) {
    if (!this.events[key]) {
      this.events[key] = [];
    }
    this.events[key].push(func);
  }
  unsubscribe(key, func) {
    if (!this.events[key]) {
      return;
    }
    this.events[key] = this.events[key].filter(f => f !== func);
  }
  dispatch(key) {
    this.events[key].forEach(fn => fn(this.data[key]));
  }
  getTask(key) {
    return this.data[key];
  }
  addTask(options) {
    const key = this.getNewKey();
    this.beginTask(key, options);
    return key;
  }
  beginTask(key, options) {
    const creator = this.getTaskCreator(options.key);
    const promise = creator(options.data);
    this.data[key] = {
      loading: true,
      options,
      promise,
    };
    promise
      .then(
        (data) => {
          this.data[key] = {
            data,
            loading: false,
            resolved: true,
          };
        },
        (err) => {
          this.data[key] = {
            error: err || true,
            loading: false,
          };
        },
      )
      .then(() => {
        this.dispatch(key);
      });
  }
  retryTask(key) {
    const options = this.data[key].options;
    this.beginTask(key, options);
  }
  getNewKey() {
    const key = this.key;
    this.key = key + 1;
    return key;
  }
}

export default UploadManager;
