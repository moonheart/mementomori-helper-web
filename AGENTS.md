# AGENTS.md

本文档为在此代码库中工作的 AI 代理提供指南。

## 项目概述

这是 MementoMori 游戏的多账户管理前端项目，从 Blazor 重构为前后端分离架构。

- **前端**: React + TypeScript + Vite + TailwindCSS
- **后端**: `api/MementoMori.Api` (ASP.NET Core)
- **游戏数据**: `api/MementoMori.Ortega` (从 il2cpp 提取的游戏代码)

## 游戏规则

参考 `docs\提取的游戏内帮助文档.md`.

## 项目结构

```
/                        # 前端 React 项目
├── src/                 # 源代码
├── api/                 # 后端 API 项目
│   ├── MementoMori.Api  # 入口项目
│   └── MementoMori.Ortega # 游戏数据层
├── blazor/              # 原始 Blazor 项目 (废弃)
└── docs/                # 文档
```

## 常用命令

```bash
# 开发
pnpm dev                 # 启动开发服务器

# 构建
pnpm build               # 构建生产版本 (tsc + vite build)
pnpm preview             # 预览生产构建

# 代码质量
pnpm lint                # 运行 ESLint
pnpm lint --fix          # 自动修复 ESLint 问题

# 类型生成
pnpm generate-types      # 从 C# 生成 TypeScript 类型定义
```

## 代码风格指南

### 导入顺序

```typescript
// 1. React 核心
import { useState, useEffect } from 'react';

// 2. 第三方库
import axios from 'axios';
import { create } from 'zustand';

// 3. 路径别名 (以 @ 开头)
import { useAccountStore } from '@/store/accountStore';
import { ortegaApi } from '@/api/ortega-client';

// 4. 相对导入
import { UserStatusDtoInfo } from '@/api/generated/userStatusDtoInfo';
```

### TypeScript 规范

- 启用 `strict: true`
- 启用 `noUnusedLocals: true` 和 `noUnusedParameters: true`
- 使用接口定义对象类型，类型别名用于联合类型/原始类型
- 显式导出所有公共类型和函数

```typescript
// Good
interface AccountState {
    accounts: AccountDto[];
    currentAccountId: number | null;
}

// Good - 使用 Zustand 进行状态管理
export const useAccountStore = create<AccountState>()(...)
```

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件 | PascalCase | `AccountsPage`, `MainLayout` |
| Hooks | camelCase (以 use 开头) | `useAccountStore`, `useToast` |
| 常量 | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRY` |
| 文件 | kebab-case | `axios-client.ts`, `account-store.ts` |
| 类型/接口 | PascalCase | `AccountDto`, `UserStatusInfo` |

### 错误处理

```typescript
// 1. API 调用使用 try-catch
try {
    const response = await ortegaApi.user.getUserData({});
    setUserInfo(response.userSyncData?.userStatusDtoInfo);
} catch (error) {
    console.error('Failed to fetch user data:', error);
    setIsLoggedIn(false);
}

// 2. axios 拦截器统一处理
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/accounts';
        }
        return Promise.reject(error);
    }
);
```

### 组件规范

```typescript
// 1. 组件放在 pages/ 或 components/ 目录
// 2. 使用函数式组件
// 3. 遵循以下结构

export function ComponentName() {
    // 1. hooks
    const [state, setState] = useState(...);

    // 2. 计算值
    const filteredItems = ...

    // 3. 副作用
    useEffect(() => {...}, []);

    // 4. 事件处理
    const handleClick = () => {...};

    // 5. 渲染
    return (...);
}
```

### CSS 与 Tailwind

- 使用 Tailwind CSS 进行样式
- 使用 `clsx` 和 `tailwind-merge` 管理动态类名
- 自定义 UI 组件放在 `components/ui/` 目录

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}
```

## 业务规则

- 类型定义通过 `pnpm generate-types` 从 C# 自动生成
- 文档统一使用中文
- 游戏接口实现在 `api/MementoMori.Api\Controllers\OrtegaProxyController.cs`
