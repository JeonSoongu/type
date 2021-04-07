class Error {
  static ctrl(msg, err) {
    return {
      isError: true,
      errMsg: err,
      clientMsg: msg,
    };
  }
}

export default Error;
