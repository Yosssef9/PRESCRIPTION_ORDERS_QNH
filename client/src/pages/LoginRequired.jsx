export default function LoginRequired() {
  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h2>Login Required</h2>
      <p>You must login from the portal first.</p>

      <button onClick={() => (window.location.href = "/login.html")}>
        Go to Portal Login
      </button>
    </div>
  );
}
