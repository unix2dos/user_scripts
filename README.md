# Tampermonkey Scripts

自己用的一些油猴脚本

## Scripts List

### weread_progress.js
微信读书侧边进度显示 (V2.0)
- 在页面右侧固定显示当前阅读进度百分比
- 自动从目录结构中提取进度信息
- 支持滚动时实时更新

**Match:** `https://weread.qq.com/web/reader/*`

---

### autodl.js
AutoDL 部署列表页面优化
- 自动添加 `page_size=300` 参数，加载更多数据
- 隐藏包含"测试"和"-dev"的表格行
- 按实时费用降序排序

**Match:** `https://www.autodl.com/deploy/list*`

---

### markdown_header.js
Markdown 标题快捷键统一
- 统一网站标题快捷键为 `Cmd/Ctrl + 数字(1-6)`
- 幕布: `Cmd+数字` → `Option+数字`
- 语雀/飞书: `Cmd+数字` → `Option+Cmd+数字`

**Match:** `mubu.com`, `yuque.com`, `feishu.cn`

---

### mubu.js
幕布网站增强工具
- 移除侧边栏冗余元素（模板中心、导入、与我协作、幕布精选、回收站）
- 添加"展开一级节点"按钮

**Match:** `https://mubu.com/app*`, `https://*.mubu.com/app*`

---

### shiguangxu.js
时光序优化
- 隐藏不需要的主菜单项（备忘录、日记、番茄专注）
- 隐藏子菜单项（全部、日程、重复）
- 将"清单"重命名为"未分配时间"

**Match:** `https://web.shiguangxu.com/*`, `https://shiguangxu.com/*`

---

### yuque.js
语雀优化
- 移除不需要的菜单项（小记、逛逛、AI 写作）
- 自动点击编辑按钮进入编辑模式
- 标题元素保持悬停状态显示锚点链接

**Match:** `https://yuque.com/*`, `https://*.yuque.com/*`
