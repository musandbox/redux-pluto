/* @flow */
import assert from "assert";
import cookie from "cookie";
import configs from "../../configs";
import AccessToken, { verify, ACCESS_TOKEN_COOKIE_NAME } from "../AccessToken";

test("AccessToken: create success", async () => {
  const accessToken = new AccessToken(configs);

  const req = {
    cookie: {},
  };

  const params = {
    username: "scott",
    password: "tiger",
  };

  return accessToken.create(req, void 0, params).then(response => {
    const cookies = cookie.parse(response.meta.headers["set-cookie"]);
    verify(
      {
        cookies: {
          [ACCESS_TOKEN_COOKIE_NAME]: cookies["access-token"],
        },
      },
      configs.auth.secret,
    ).then(token => {
      assert.strictEqual(token.sub, "scott");
    });
  });
});

test("AccessToken: create failure", async done => {
  const accessToken = new AccessToken(configs);

  const req: any = {
    cookie: {},
  };

  const params: any = {
    username: "notuser",
    password: "notpassword",
  };

  return (accessToken: any).create(req, void 0, params).then(done.fail, e => {
    assert.strictEqual(e.statusCode, 400);
    assert.strictEqual(e.message, "Bad Request");
    done();
  });
});
