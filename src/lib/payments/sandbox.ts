export const ESEWA_SANDBOX_IDS = [
  "9806800001",
  "9806800002",
  "9806800003",
  "9806800004",
  "9806800005",
] as const;

export const ESEWA_SANDBOX_PASSWORD =
  process.env.NEXT_PUBLIC_ESEWA_SANDBOX_PASSWORD ||
  process.env.ESEWA_SANDBOX_PASSWORD ||
  "Nepal@123";
export const ESEWA_SANDBOX_MPIN =
  process.env.NEXT_PUBLIC_ESEWA_SANDBOX_MPIN ||
  process.env.ESEWA_SANDBOX_MPIN ||
  "1122";
export const ESEWA_SANDBOX_TOKEN =
  process.env.NEXT_PUBLIC_ESEWA_SANDBOX_TOKEN ||
  process.env.ESEWA_SANDBOX_TOKEN ||
  "123456";

export const KHALTI_SANDBOX_IDS = [
  "9800000000",
  "9800000001",
  "9800000002",
  "9800000003",
  "9800000004",
] as const;

export const KHALTI_SANDBOX_MPIN =
  process.env.NEXT_PUBLIC_KHALTI_SANDBOX_MPIN ||
  process.env.KHALTI_SANDBOX_MPIN ||
  "1111";
export const KHALTI_SANDBOX_OTP =
  process.env.NEXT_PUBLIC_KHALTI_SANDBOX_OTP ||
  process.env.KHALTI_SANDBOX_OTP ||
  "987654";

export type WalletGateway = "ESEWA" | "KHALTI";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function verifyEsewaSandboxCredentials(input: {
  esewaId: string;
  password: string;
  mpin: string;
  token: string;
}) {
  const id = digitsOnly(input.esewaId);
  return (
    ESEWA_SANDBOX_IDS.includes(id as (typeof ESEWA_SANDBOX_IDS)[number]) &&
    input.password === ESEWA_SANDBOX_PASSWORD &&
    input.mpin === ESEWA_SANDBOX_MPIN &&
    input.token === ESEWA_SANDBOX_TOKEN
  );
}

export function verifyKhaltiSandboxCredentials(input: {
  mobile: string;
  mpin: string;
  otp: string;
}) {
  const mobile = digitsOnly(input.mobile);
  return (
    KHALTI_SANDBOX_IDS.includes(
      mobile as (typeof KHALTI_SANDBOX_IDS)[number],
    ) &&
    input.mpin === KHALTI_SANDBOX_MPIN &&
    input.otp === KHALTI_SANDBOX_OTP
  );
}
