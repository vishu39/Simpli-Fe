export const regexService = {
  emailRegex:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  contactRegex: /^\+?[1-9][0-9]{7,14}$/,
  dbRegex: /^[A-Za-z0-9_-]+$/,
  s3BucketRegex: /^[a-z0-9.-]{3,63}$/,
  linkRegexPattern:
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/,
  zeroToTwentyFourRegex: /^(2[0-3]|[01]?[0-9]):(00|30)$/,
  accountNo: /^\d{9,18}$/,
  ifsc: /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/,
  emailRegexMultiple:
    /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(,\s[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
  negativeToPositiveWithoutDecimal: /^(0|(-?[1-9]|-?(1[0-9]|2[0-4])))$/,
  positiveIntegerOneToTwentyFour: /^(1|2[0-4]|[1-9]|1[0-9])$/,
  positiveIntegerOneToInfinity: /^[1-9][0-9]*$/
};
