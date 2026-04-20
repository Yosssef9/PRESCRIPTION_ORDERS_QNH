const { sql, getPool } = require("../../config/db");

async function spVerifyRecipientUser(userCode, password) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("USER_CODE", sql.VarChar(50), userCode)
    .input("USER_PASSWORD", sql.VarChar(100), password)
    .execute("SP_CHECK_PH_USER_PW");

  const row = result.recordset?.[0];

  if (!row) return null;

  const isValid =
    row.IS_VALID === 1 ||
    row.IS_VALID === true ||
    row.IsValid === 1 ||
    row.IsValid === true;

  if (!isValid) return null;

  return {
    userCode: row.USER_CODE || userCode,
    userName: row.USER_NAME || row.USER_FULL_NAME || userCode,
  };
}

module.exports = spVerifyRecipientUser;
