export default function LoginRequired() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(161,136,127,0.18),transparent_20%),linear-gradient(180deg,#f8f3f0_0%,#f2e9e4_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-[rgba(121,85,72,0.14)] bg-white shadow-[0_24px_60px_rgba(78,52,46,0.12)] md:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4e342e] via-[#6d4c41] to-[#8d6e63] p-10 text-white md:block">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  Secure Access
                </div>

                <h1 className="max-w-sm text-4xl font-bold leading-tight">
                  Portal authentication is required
                </h1>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/85">
                  To access this page, please sign in through the hospital
                  portal first. Once authenticated, you will be redirected back
                  with the required access.
                </p>
              </div>

              <div className="text-sm text-white/75">
                Protected internal page
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5d4037] to-[#795548] text-3xl text-white shadow-[0_10px_24px_rgba(93,64,55,0.25)]">
                🔒
              </div>

              <h2 className="text-3xl font-bold text-[#4e342e]">
                Login Required
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#6d4c41]">
                You must login from the portal first before opening this page.
              </p>

              <div className="mt-6 rounded-2xl border border-[#d7ccc8] bg-[#fcf8f6] p-4">
                <div className="text-sm font-semibold text-[#5d4037]">
                  Why am I seeing this?
                </div>
                <p className="mt-2 text-sm leading-6 text-[#795548]">
                  This page is available only for authenticated portal users.
                  Please login, then return to continue.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => (window.location.href = "/login.html")}
                  className="inline-flex h-[48px] items-center justify-center rounded-xl bg-gradient-to-br from-[#5d4037] to-[#795548] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(93,64,55,0.22)] transition hover:opacity-95 active:scale-[0.98]"
                >
                  Go to Portal Login
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="inline-flex h-[48px] items-center justify-center rounded-xl border border-[#d7ccc8] bg-white px-6 text-sm font-bold text-[#5d4037] transition hover:bg-[#f7f1ee] active:scale-[0.98]"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
