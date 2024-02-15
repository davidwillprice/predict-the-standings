export interface Props {
  strokeWidth: number;
  type:
    | "accessibility"
    | "error"
    | "f1"
    | "group"
    | "help"
    | "listBullet"
    | "loading"
    | "login"
    | "profile"
    | "premierLeague"
    | "stats"
    | "success"
    | "trophy";
}

const iconPaths = {
  accessibility: (
    <>
      <path
        vectorEffect="non-scaling-stroke"
        d="M21,12C21,16.937 16.937,21 12,21C7.063,21 3,16.937 3,12C3,7.063 7.063,3 12,3C16.937,3 21,7.063 21,12Z"
      />
      <g transform="matrix(1.17965,0,0,1.17965,-3.92522,-2.57864)">
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10,10L11.019,10.583C11.77,11.011 12.604,11.231 13.44,11.241M17,10L15.981,10.583C15.23,11.011 14.396,11.231 13.56,11.241M11.403,17L13.44,11.241M15.585,17L13.56,11.241M13.44,11.241C13.48,11.241 13.52,11.241 13.56,11.241"
        />
      </g>
      <g transform="matrix(0.666247,0,0,0.666247,3.00567,1.64685)">
        <circle
          fill="currentColor"
          vectorEffect="non-scaling-stroke"
          cx="13.5"
          cy="8"
          r="1.5"
        />
      </g>
    </>
  ),
  error: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </>
  ),
  f1: (
    <>
      <g transform="matrix(1.05046,0,0,1.05046,-1.1308,-1.1308)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M21,12.5C21,17.194 17.194,21 12.5,21C7.806,21 4,17.194 4,12.5C4,7.806 7.806,4 12.5,4C17.194,4 21,7.806 21,12.5Z"
        />
      </g>
      <g transform="matrix(1.05046,0,0,1.05046,-1.1308,-1.1308)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M12.5,11L12.5,7M12.5,11C13.165,11 13.729,11.433 13.926,12.032M12.5,11C11.835,11 11.271,11.433 11.075,12.032M12.5,7C10.185,7 8.205,8.43 7.393,10.454M12.5,7C14.815,7 16.795,8.43 17.607,10.454M8.611,16.389L11.439,13.561M16.389,16.389L13.561,13.561M13.561,13.561C13.832,13.289 14,12.914 14,12.5C14,12.336 13.974,12.179 13.926,12.032M13.561,13.561C13.289,13.832 12.914,14 12.5,14C11.672,14 11,13.328 11,12.5C11,12.336 11.026,12.179 11.075,12.032M13.926,12.032L17.607,10.454M11.075,12.032L7.393,10.454M7.393,10.454C7.14,11.087 7,11.777 7,12.5C7,15.538 9.462,18 12.5,18C15.538,18 18,15.538 18,12.5C18,11.777 17.86,11.087 17.607,10.454"
        />
      </g>
    </>
  ),
  group: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </>
  ),
  help: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
      />
    </>
  ),
  listBullet: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </>
  ),
  loading: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </>
  ),
  login: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
      />
    </>
  ),
  premierLeague: (
    <>
      <g transform="matrix(1.05539,0,0,1.05539,-0.136956,-0.136956)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M9,11.143L11.5,9L14,11.143L12.75,14L10.25,14L9,11.143Z"
        />
      </g>
      <g transform="matrix(1.05539,0,0,1.05539,-0.136956,-0.136956)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M3,11.5L6,10L5.004,6.017M3,11.5C3,15.28 5.468,18.484 8.88,19.589M3,11.5C3,9.411 3.754,7.497 5.004,6.017M18.716,16.005L14.604,16.304L14.12,19.589M4.284,16.005L8.396,16.304L8.88,19.589M8.904,3.404C9.722,3.142 10.595,3 11.5,3C12.405,3 13.278,3.142 14.096,3.404M8.904,3.404L11.5,6L14.096,3.404M8.904,3.404C7.368,3.896 6.022,4.813 5.004,6.017M14.096,3.404C15.651,3.902 17.011,4.836 18.033,6.061M14.12,19.589C17.533,18.484 20,15.28 20,11.5L20,11.476M14.12,19.589C13.295,19.856 12.414,20 11.5,20C10.586,20 9.705,19.856 8.88,19.589M20,11.476L17.048,10L18.033,6.061M20,11.476C19.994,9.417 19.256,7.53 18.033,6.061"
        />
      </g>
    </>
  ),
  profile: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </>
  ),
  stats: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
    </>
  ),
  success: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </>
  ),

  trophy: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721A48.339 48.339 0 0112 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"></path>
    </>
  ),
};

export default function Icon({ strokeWidth, type }: Props) {
  const content =
    type === "accessibility"
      ? iconPaths.accessibility
      : type === "error"
      ? iconPaths.error
      : type === "f1"
      ? iconPaths.f1
      : type === "group"
      ? iconPaths.group
      : type === "help"
      ? iconPaths.help
      : type === "listBullet"
      ? iconPaths.listBullet
      : type === "loading"
      ? iconPaths.loading
      : type === "login"
      ? iconPaths.login
      : type === "profile"
      ? iconPaths.profile
      : type === "premierLeague"
      ? iconPaths.premierLeague
      : type === "stats"
      ? iconPaths.stats
      : type === "success"
      ? iconPaths.success
      : type === "trophy"
      ? iconPaths.trophy
      : "";
  if (!content) {
    throw new Error("Icon type hasn't been correctly set");
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24">
      {content}
    </svg>
  );
}
