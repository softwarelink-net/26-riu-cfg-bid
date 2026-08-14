# 开放式架构的远程接口单元接口配置工具招标数字化全案系统

- **上线主域名**: [https://26-riu-cfg-bid.softwarelink.net/](https://26-riu-cfg-bid.softwarelink.net/)
- **代码仓库**: [https://github.com/softwarelink-net/26-riu-cfg-bid](https://github.com/softwarelink-net/26-riu-cfg-bid)
- **Dashboard 预览图**: `./docs/screenshots/dashboard-preview.png`

---

## 部署与运行说明

### 1. 环境要求
- Node.js >= 20.0.0
- npm / pnpm >= 9.0.0
- Wrangler CLI >= 3.50.0

### 2. 安装依赖
```bash
npm install
```

### 3. 本地运行
```bash
# 启动本地全栈模拟环境 (Worker + D1 + R2 + Vite)
npm run dev
```

### 4. 演示账号
- **管理员 (Admin)**: `admin@softwarelink.net` / `Admin@2026!Sec` (Role: AVIONICS_ADMIN)
- **审计员 (Auditor)**: `auditor@softwarelink.net` / `Auditor@2026!Sec` (Role: AUDITOR)
- **访客 (Guest)**: 免密直接访问公开模块

### 5. 生产构建
```bash
npm run build
```

### 6. 部署到 Cloudflare (Workers 模式)
```bash
# 执行 D1 数据库迁移
npx wrangler d1 migrations apply Allworld --remote
# 全量发布至 Cloudflare Workers
npm run deploy
```

### 7. 常用脚本一览
- `npm run dev`: 本地开发调试服务
- `npm run build`: 前端 Vite 打包与 Worker 编译
- `npm run lint`: 静态代码安全与语法检查
- `npm run db:seed`: 注入初始化业务种子数据
- `npm run deploy`: 部署至生产 Workers 边缘网络

### 8. 目录结构
```text
.
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   └── GlobalTopBanner.vue
│   │   └── riu/
│   ├── layouts/
│   │   ├── AuthLayout.vue
│   │   └── MainLayout.vue
│   ├── router/
│   ├── stores/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── functions/ (or worker/)
│   ├── api/
│   └── index.ts
├── migrations/
│   └── 0001_init_schema.sql
├── wrangler.toml
├── package.json
└── README.md
```

---

## 招标公告全文

* **标题**: 开放式架构的远程接口单元接口配置工具招标公告
* **项目发包方**: 中国航空工业集团公司西安航空计算技术研究所
* **项目编号**: 0730-2611010442/01
* **项目发布时间**: 2026/08/03 10:37:16
* **关键词**: 西安航空计算技术研究所, 远程接口单元, RIU配置工具, 开放式架构, 航空软件招标, 接口控制文件, 0730-2611010442/01
* **摘要**: 中国航空工业集团公司西安航空计算技术研究所就“开放式架构的远程接口单元接口配置工具”进行公开招标。项目采购数量为壹套，要求PC端配置工具基于接口控制文件和数据配置文件，自动生成驻留Flash的二进制配置文件及供机载联合编译的独立C/H解析函数。
* **技术要点**: 
  1. 运行于PC端，解析ICD与数据配置文件；
  2. 生成紧凑型二进制配置流并驻留Flash/非易失介质；
  3. 独立生成标准C语言（`.c`及`.h`）解析驱动代码并与应用软件无缝联合编译；
  4. 交付周期严格：30天完成详设，45天完成软硬件，60天完成调试与最终交付。
* **技术创新性**: 突破传统硬编码接口驱动模式，采用开放式架构元数据驱动模型，实现航空机载航电I/O接口配置的解耦、高可靠离线代码静态生成与全生命周期版本可追溯性。

---

## 免责声明

1. **数据来源与合规性**：本系统展示的所有招标信息、项目背景及采购需求均来源于公开招投标平台（如中国招标投标公共服务平台、中国建设银行龙集采平台等）。系统仅用于技术方案演示、架构原型验证与演示搭建，不涉及任何商业非法抓取或数据篡改。
2. **技术实现路径**：本系统前端基于 Vue 3 + Tailwind CSS 构建，后端基于 Cloudflare Workers 极简无服务器架构，数据存储采用 Cloudflare D1 关系型数据库，完整符合分布式高可用与银企对接安全标准。
3. **保密承诺**：开发团队严格遵守保密义务，系统内示例数据均经过伪化脱敏处理（Anonymized），不包含真实患者医疗健康信息（PHI）或建行敏感金融交易数据。
4. **知识产权与巧合声明**：本系统中涉及的商标、机构名称（中国建设银行、川北医学院附属医院等）归各自合法持有人所有。演示代码与系统架构若与实际投产系统存在相似之处，纯属技术通用设计之巧合。
5. **免责条款**：本演示系统不具备实际金融扣款功能，不承担因非授权使用、不可抗力或第三方平台接口变更所导致的任何法律责任与经济损失。
