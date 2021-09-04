const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

    // Iyzico
    IYZICO_API_KEY: Joi.string().description('iyzico api key'),
    IYZICO_SECRET_KEY: Joi.string().description('iyzico secret key'),
    IYZICO_URL: Joi.string().description('iyzico url key'),
    IYZICO_CALLBACK_URL: Joi.string().description('iyzico callback key'),
    //IYZICO_SUBMERCHANT_KEY: Joi.string().description('iyzico sub merchant key'),

    // Pusher.js
    PUSHER_APP_ID: Joi.string().description('pusher app id'),
    PUSHER_KEY: Joi.string().description('pusher key'),
    PUSHER_SECRET: Joi.string().description('pusher secret'),
    PUSHER_CLUSTER: Joi.string().description('pusher cluster'),

    // Algolia Search
    ALGOLIA_APP_ID: Joi.string().description('algolia app id'),
    ALGOLIA_PRIVATE_KEY: Joi.string().description('algolia key'),

    // SMS Provider
    SMS_PROVIDER: Joi.string().description('sms provider name'),
    SMS_USER: Joi.string().description('sms provider user').required(),
    SMS_PASSWORD: Joi.string().description('sms provider password'),
    SMS_TITLE: Joi.string().description('sms provider title'),

    // AWS
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS_KEY_ID required'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS_SECRET_KEY_ID required'),
    AWS_SECRET_BUCKET: Joi.string().description('AWS_SECRET_BUCKET required'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  iyzico: {
    apiKey: envVars.IYZICO_API_KEY,
    secretKey: envVars.IYZICO_SECRET_KEY,
    url: envVars.IYZICO_URL,
    callbackUrl: envVars.IYZICO_CALLBACK_URL,
    //subMerchantKey: envVars.IYZICO_SUBMERCHANT_KEY,
  },
  pusher: {
    appId: envVars.PUSHER_APP_ID,
    key: envVars.PUSHER_KEY,
    secret: envVars.PUSHER_SECRET,
    cluster: envVars.PUSHER_CLUSTER,
  },
  algolia: {
    appId: envVars.ALGOLIA_APP_ID,
    key: envVars.ALGOLIA_PRIVATE_KEY,
  },
  smsService: {
    smsProvider: envVars.SMS_PROVIDER,
    smsUser: envVars.SMS_USER,
    smsPassword: envVars.SMS_PASSWORD,
    smsTitle: envVars.SMS_TITLE,
  },
  aws: {
    keyId: envVars.AWS_ACCESS_KEY_ID,
    secretKeyId: envVars.AWS_SECRET_ACCESS_KEY,
    bucket: envVars.AWS_SECRET_BUCKET,
  },
};
