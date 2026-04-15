import { auth } from "@/lib/auth";

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__avatar">{getInitials(user?.name)}</div>

        <h1 className="profile-card__title">Your Profile</h1>

        <div className="profile-card__row">
          <span className="profile-card__label">Name</span>
          <span className="profile-card__value">{user?.name || "User"}</span>
        </div>

        <div className="profile-card__row">
          <span className="profile-card__label">Email</span>
          <span className="profile-card__value">{user?.email || "No email"}</span>
        </div>

        <p className="profile-card__note">Read-only profile info for your account.</p>
      </div>
    </div>
  );
}
