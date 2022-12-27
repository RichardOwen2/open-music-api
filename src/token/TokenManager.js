const Jwt = require('@hapi/jwt');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    const artifacts = Jwt.token.decode(refreshToken);
    Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
    const { payload } = artifacts.decoded;
    return payload;
  },
};

module.exports = TokenManager;
