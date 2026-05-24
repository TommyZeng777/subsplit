# subsplit

一个纯前端的订阅费用分摊计算器，适合用 GitHub Pages 直接托管。

在线访问地址：

https://tommyzeng777.github.io/subsplit/

## 功能

- 多币种费用录入，人民币作为主结算货币，汇率按公开数据源刷新
- 地区和套餐参考价，包括 US/TR/IN/ID/BR/MX/EG/JP/KR/TW/CA/EU/UK 等区域
- 可填写号主人民币总成本，用于覆盖外币换算结果
- 可设置月租拼或年租拼，并自动生成续费/到期日期
- 权益池权重分摊，例如 Codex / 网页
- 号主责任补偿与控制权收益调节
- 成员编号、用户 ID、权益勾选和最终应付金额
- 自动生成拼车公约与费用公示
- 导出 CSV 和带水印的 PDF 公约打印页

## 本地使用

直接打开 `index.html` 即可使用。

## GitHub Pages 部署

1. 新建一个 GitHub 仓库。
2. 上传 `index.html`、`styles.css`、`app.js`、`README.md`、`LICENSE` 和 `.nojekyll`。
3. 进入仓库 `Settings` -> `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 生成访问链接。

## 说明

数据默认保存在浏览器本地，不会上传到服务器。刷新汇率功能会访问公开汇率接口；如果接口不可用，请稍后重新刷新。

## License

MIT
