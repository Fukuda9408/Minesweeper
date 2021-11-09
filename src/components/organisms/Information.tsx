export const Information = (props: {
  remainBomb: number;
  openedButtonNum: number;
}) => {
  const { remainBomb, openedButtonNum } = props;
  return (
    <div>
      残りの爆弾数: {remainBomb}
      <br />
      開けた数: {openedButtonNum}
      <br />
    </div>
  );
};
