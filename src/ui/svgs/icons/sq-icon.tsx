export interface Props {
  strokeWidth: number;
  type: IconType;
}

export type IconType =
  | "arrowLeft"
  | "accessibility"
  | "discord"
  | "driver"
  | "edit"
  | "error"
  | "f1"
  | "github"
  | "google"
  | "group"
  | "help"
  | "listBullet"
  | "loading"
  | "login"
  | "logout"
  | "microphone"
  | "moon"
  | "profile"
  | "premierLeague"
  | "reddit"
  | "star"
  | "stats"
  | "submit"
  | "sun"
  | "success"
  | "trophy"
  | "twitter"
  | "up"
  | "wrenchScrewdriver";

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
  arrowLeft: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  ),
  discord: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    </>
  ),
  driver: (
    <>
      <path
        vectorEffect="non-scaling-stroke"
        d="M21.256,8.382C21.555,9.316 22.546,17.497 22.138,19.05C21.679,20.798 21.391,23.375 18.066,22.146C13.976,20.694 3.746,17.113 2.921,16.697C1.546,12.996 1.704,6.936 4.101,5.54C3.871,5.139 3.289,3.92 3.16,3.625C4.731,2.054 9.691,1.533 11.912,1.533C14.841,1.533 17.487,2.845 19.29,4.909C20.166,5.911 20.842,7.09 21.256,8.382ZM22.235,17.338C20.565,16.844 18.174,16.263 16.201,15.694C13.822,15.008 13.027,12.803 13.106,10.704C15.36,11.267 18.684,12.275 21.709,11.218"
      />
    </>
  ),
  edit: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
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
  github: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
    </>
  ),
  google: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z"
        strokeWidth="0"
        fill="currentColor"
      />
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
  logout: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </>
  ),
  microphone: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
      />
    </>
  ),
  moon: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
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
  reddit: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z" />
      <path d="M12 8l1 -5l6 1" />
      <path d="M19 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <circle cx="9" cy="13" r=".5" fill="currentColor" />
      <circle cx="15" cy="13" r=".5" fill="currentColor" />
      <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
    </>
  ),
  star: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
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
  submit: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </>
  ),
  sun: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
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
  twitter: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
    </>
  ),
  up: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </>
  ),
  wrenchScrewdriver: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
      />
    </>
  ),
};

export default function Icon({ strokeWidth, type }: Props) {
  const content =
    type === "accessibility"
      ? iconPaths.accessibility
      : type === "arrowLeft"
      ? iconPaths.arrowLeft
      : type === "discord"
      ? iconPaths.discord
      : type === "driver"
      ? iconPaths.driver
      : type === "edit"
      ? iconPaths.edit
      : type === "error"
      ? iconPaths.error
      : type === "f1"
      ? iconPaths.f1
      : type === "github"
      ? iconPaths.github
      : type === "google"
      ? iconPaths.google
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
      : type === "logout"
      ? iconPaths.logout
      : type === "microphone"
      ? iconPaths.microphone
      : type === "moon"
      ? iconPaths.moon
      : type === "profile"
      ? iconPaths.profile
      : type === "premierLeague"
      ? iconPaths.premierLeague
      : type === "reddit"
      ? iconPaths.reddit
      : type === "star"
      ? iconPaths.star
      : type === "stats"
      ? iconPaths.stats
      : type === "submit"
      ? iconPaths.submit
      : type === "success"
      ? iconPaths.success
      : type === "sun"
      ? iconPaths.sun
      : type === "trophy"
      ? iconPaths.trophy
      : type === "twitter"
      ? iconPaths.twitter
      : type === "up"
      ? iconPaths.up
      : type === "wrenchScrewdriver"
      ? iconPaths.wrenchScrewdriver
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
