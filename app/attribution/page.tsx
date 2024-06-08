export const runtime = "edge";
import { Metadata } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

export const metadata: Metadata = {
  title: "Attribution | Predict The Standings",
};

export default function Page() {
  return (
    <>
      <PanelHeading>
        <h2>Attribution</h2>
      </PanelHeading>
      <Panel>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://www.freepik.com/free-vector/line-wave-background-gradient-style-template_57150990.htm">
              Line wave background
            </a>
            , designed by{" "}
            <a
              target="_blank"
              href="https://www.freepik.com/author/andreacharlesta">
              AndreaCharlesta
            </a>
            .
          </li>
          <li>
            SVG icons designed by{" "}
            <a target="_blank" href="https://heroicons.com/">
              Hero Icons
            </a>
            :
            <ul>
              <li>arrow-path</li>
              <li>arrow-right-end-on-rectangle</li>
              <li>arrow-right-start-on-rectangle</li>
              <li>arrow-up-circle</li>
              <li>arrow-up-tray</li>
              <li>chart-bar-square</li>
              <li>check-circle</li>
              <li>list-bullet</li>
              <li>microphone</li>
              <li>moon</li>
              <li>pencil-square</li>
              <li>question-mark-circle</li>
              <li>star</li>
              <li>sun</li>
              <li>table-cells</li>
              <li>trophy</li>
              <li>pencil-square</li>
              <li>user-circle</li>
              <li>user-group</li>
              <li>wrench-screwdriver</li>
              <li>x-circle</li>
            </ul>
          </li>
        </ul>
      </Panel>
    </>
  );
}
