import panelStyles from "./ui/styles/panel.module.scss";

interface Props {
  children: string;
}

export const Panel = ({ children }: Props) => {
  return <div className={panelStyles.panel}>{children}</div>;
};
