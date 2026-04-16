"use client";

import Image from "next/image";
import { ReactNode, RefObject } from "react";

export type DrawerItem = {
  label: string;
  active?: boolean;
  icon: ReactNode;
};

export type DrawerProfile = {
  fullName: string;
  nickname: string;
  profilePhotoUrl: string | null;
};

type SideDrawerProps = {
  drawerRef: RefObject<HTMLElement | null>;
  isLoggingOut: boolean;
  isVisible: boolean;
  items: DrawerItem[];
  onClose: () => void;
  onCreatePost: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenStream?: () => void;
  onSelectItem?: (item: DrawerItem) => void;
  profile: DrawerProfile;
};

function getInitials(fullName: string) {
  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return "GG";
  }

  const [first = "", second = ""] = trimmedName.split(/\s+/);
  return `${first[0] ?? ""}${second[0] ?? first[1] ?? ""}`.toUpperCase();
}

function DrawerCloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function DrawerLogoutIcon() {
  return <img src="/icons/logout.svg" alt="" aria-hidden="true" className="h-6 w-6" />;
}

export function SideDrawer({
  drawerRef,
  isLoggingOut,
  isVisible,
  items,
  onClose,
  onCreatePost,
  onLogout,
  onOpenProfile,
  onOpenStream,
  onSelectItem,
  profile,
}: SideDrawerProps) {
  return (
    <div className="fixed inset-0 z-40 flex h-screen w-full sm:mx-auto sm:max-w-[390px]" aria-hidden={!isVisible}>
      <div className="relative h-screen w-full">
        <button
          type="button"
          className={`absolute inset-0 bg-[#0a0d12] transition-opacity duration-300 ${isVisible ? "opacity-70" : "opacity-0"}`}
          aria-label="Close menu"
          onClick={onClose}
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 flex">
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-drawer-title"
            className={`pointer-events-auto relative z-10 flex h-screen w-[calc(100%-64px)] min-w-[326px] max-w-[326px] flex-col bg-white p-4 shadow-[0_20px_24px_rgba(10,13,18,0.08),0_8px_8px_rgba(10,13,18,0.03),0_3px_3px_rgba(10,13,18,0.04)] transition-transform duration-300 ${
              isVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[#f5f5f5] p-2 text-[#737373]"
                  aria-label="Close menu"
                  onClick={onClose}
                >
                  <DrawerCloseIcon />
                </button>
                <p id="menu-drawer-title" className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">
                  Global Gardeners
                </p>
              </div>

              <button type="button" onClick={onOpenProfile} className="mt-14 flex items-center gap-3 text-left" aria-label="Open your profile">
                {profile.profilePhotoUrl ? (
                  <Image
                    alt={profile.fullName}
                    className="h-12 w-12 rounded-full object-cover"
                    height={48}
                    loader={({ src }) => src}
                    src={profile.profilePhotoUrl}
                    unoptimized
                    width={48}
                  />
                ) : (
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#31674c] text-[16px] font-semibold text-[#fafafa]">
                    {getInitials(profile.fullName)}
                  </div>
                )}
                <div>
                  <p className="text-[16px] font-semibold leading-6 text-black">{profile.fullName}</p>
                  <p className="mt-1 text-[14px] font-medium leading-5 text-[#525252]">{profile.nickname}</p>
                </div>
              </button>

              <nav className="mt-8 flex flex-col gap-1">
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (onSelectItem) {
                        onSelectItem(item);
                        return;
                      }
                      if (item.label === "Stream" && onOpenStream) {
                        onOpenStream();
                      }
                    }}
                    className={`flex h-[52px] items-center gap-4 rounded-[100px] px-4 text-left text-[16px] font-medium leading-6 ${
                      item.active ? "bg-[#f8fafc] text-[#457941]" : "text-[#333333cc]"
                    }`}
                  >
                    <span className="h-6 w-6 shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <button
                type="button"
                onClick={onCreatePost}
                className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#171717] text-[14px] font-medium leading-5 text-[#fafafa]"
              >
                <span className="text-[22px] leading-none">+</span>
                <span>Create Post</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="mt-auto mb-2 inline-flex h-[52px] items-center gap-4 rounded-full px-4 text-[16px] font-medium leading-6 text-[#dc2626]"
              >
                <DrawerLogoutIcon />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
