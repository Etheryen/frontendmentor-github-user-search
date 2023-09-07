import Head from "next/head";
import { type FormEvent, useRef } from "react";
import { SearchIcon } from "~/components/svg/SearchIcon";
import { atom, useAtom } from "jotai";
import { api } from "~/utils/api";
import Image from "next/image";
import { PinIcon } from "~/components/svg/PinIcon";
import { TwitterIcon } from "~/components/svg/TwitterIcon";
import { LinkIcon } from "~/components/svg/LinkIcon";
import { BackpackIcon } from "~/components/svg/BackpackIcon";
import { cn } from "~/utils/tailwind-merge";
import dayjs from "dayjs";
import { Toaster, toast } from "react-hot-toast";

const usernameAtom = atom<string | null>(null);

export default function Home() {
  const [username] = useAtom(usernameAtom);

  return (
    <>
      <Head>
        <title>devfinder</title>
        <meta name="description" content="devfinder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-200">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex w-[50rem] flex-col items-center gap-6">
            <h1 className="w-full text-3xl font-bold">devfinder</h1>
            <SearchBar />
            {!!username && <SearchedUser username={username} />}
          </div>
        </div>
      </main>
      <Toaster position="bottom-center" />
    </>
  );
}

function SearchBar() {
  const searchRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUsername] = useAtom(usernameAtom);

  // TODO: DELETE
  // setUsername("etheryen");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!searchRef.current) return;
    if (searchRef.current.value === "") return;

    setUsername(searchRef.current.value);
    searchRef.current.value = "";
  };

  return (
    <div className="flex w-full items-center rounded-xl bg-slate-800 p-2">
      <label htmlFor="search" className="px-4 text-blue-600">
        <SearchIcon />
      </label>
      <form
        onSubmit={onSubmit}
        className="flex flex-1 items-center justify-between"
      >
        <input
          ref={searchRef}
          type="text"
          name="search"
          id="search"
          placeholder="Search GitHub username..."
          className="h-full flex-1 bg-transparent pr-4 font-mono text-xl outline-none"
        />
        <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700">
          Search
        </button>
      </form>
    </div>
  );
}

function SearchedUser({ username }: { username: string }) {
  const {
    data: profileData,
    isLoading,
    error,
  } = api.profiles.getProfileByUsername.useQuery(
    {
      username,
    },
    { retry: 1 },
  );

  if (isLoading)
    return <span className="loading loading-dots loading-lg mt-8" />;
  if (error) {
    const errorMessage =
      error.message === "Not Found"
        ? `User "${username}" not found`
        : `Error: ${error.message}`;

    toast.remove();
    toast.error(errorMessage, {
      style: {
        backgroundColor: "rgb(30 41 59)",
        color: "rgb(226 232 240)",
        fontWeight: "semibold",
      },
    });

    return null;
  }

  const profile = profileData.data;
  const formattedDate = dayjs(profile.created_at).format("DD MMM YYYY");

  return (
    <div className="flex w-full gap-8 rounded-xl bg-slate-800 p-8">
      <Image
        width={150}
        height={150}
        src={profile.avatar_url}
        alt={`${profile.login}'s avatar`}
        className="h-fit rounded-full"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold">{profile.name}</div>
            <div className="font-mono text-blue-600">@{profile.login}</div>
          </div>
          <div className="font-mono text-slate-400">Joined {formattedDate}</div>
        </div>
        <p className="font-mono text-slate-400">
          {profile.bio ?? "This profile has no bio"}
        </p>
        <div className="my-4 flex justify-around rounded-xl bg-slate-900 px-8 py-4">
          <div className="flex flex-col">
            <div className="font-mono text-sm text-slate-400">Repos</div>
            <div className="text-xl font-bold">{profile.public_repos}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-mono text-sm text-slate-400">Followers</div>
            <div className="text-xl font-bold">{profile.followers}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-mono text-sm text-slate-400">Following</div>
            <div className="text-xl font-bold">{profile.following}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono">
          <div
            className={cn("flex items-center gap-4", {
              "text-slate-400": !profile.location,
            })}
          >
            <div>
              <PinIcon />
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {profile.location ?? "Not Available"}
            </div>
          </div>
          <div
            className={cn("flex items-center gap-4", {
              "text-slate-400": !profile.twitter_username,
            })}
          >
            <div>
              <TwitterIcon />
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {profile.twitter_username ?? "Not Available"}
            </div>
          </div>
          <div
            className={cn("flex items-center gap-4", {
              "text-slate-400": !profile.blog,
            })}
          >
            <div>
              <LinkIcon />
            </div>
            {profile.blog ? (
              <a
                href={profile.blog}
                target="_blank"
                className="overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
              >
                {profile.blog}
              </a>
            ) : (
              <div className="overflow-hidden text-ellipsis">Not Available</div>
            )}
          </div>
          <div
            className={cn("flex items-center gap-4", {
              "text-slate-400": !profile.company,
            })}
          >
            <div>
              <BackpackIcon />
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {profile.company ?? "Not Available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
