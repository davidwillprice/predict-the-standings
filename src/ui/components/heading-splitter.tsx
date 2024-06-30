import commonStyles from "@styles/common.module.scss";

export const HeadingSplitter = () => (
  <>
    <span className={commonStyles.mobile_hide}> - </span>
    <span className={commonStyles.mobile_show}>
      <br />
    </span>
  </>
);
