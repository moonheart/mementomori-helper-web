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

---

## Master 数据管理

### 概述

Master 数据是游戏的静态配置数据（角色、装备、道具等定义），存储在 `src/api/generated/` 目录下，以 `MB` (MasterBook) 结尾的类表示。

### 数据获取方式

#### 1. 使用 Hook 获取单条数据

```typescript
import { useMasterData } from '@/hooks/useMasterData';

export function CharacterDetail({ characterId }: { characterId: number }) {
    const { data: character, loading } = useMasterData<CharacterMB>('CharacterTable', characterId);
    
    if (loading) return <div>加载中...</div>;
    if (!character) return <div>未找到角色</div>;
    
    return <div>{character.nameKey}</div>;
}
```

#### 2. 使用 Hook 获取全表数据

```typescript
import { useMasterTable } from '@/hooks/useMasterData';

export function CharacterList() {
    const { data: characters, loading } = useMasterTable<CharacterMB[]>('CharacterTable');
    
    if (loading) return <div>加载中...</div>;
    
    return (
        <ul>
            {characters?.map(c => <li key={c.id}>{c.nameKey}</li>)}
        </ul>
    );
}
```

#### 3. 直接使用 Store

```typescript
import { useMasterStore } from '@/store/masterStore';

const getRecord = useMasterStore(state => state.getRecord);
const getTable = useMasterStore(state => state.getTable);

// 获取单条记录
const character = await getRecord<CharacterMB>('CharacterTable', 1001);

// 获取全表
const allCharacters = await getTable<CharacterMB[]>('CharacterTable');
```

### 游戏文本资源 Key 查询方式

"E:\Git_Github\MementoMoriData\Master\TextResourceZhCnMB.json" 此文件是游戏文本资源 Key 的字典，文件很大, 不要直接读取, 使用搜索来查询.

示例格式

``` json
[
  {
    "Id": 350,
    "IsIgnore": false,
    "Memo": "",
    "StringKey": "[CharacterSortTypeBattlePower]",
    "Text": "战斗力"
  },
  {
    "Id": 351,
    "IsIgnore": false,
    "Memo": "",
    "StringKey": "[CharacterSortTypeRootCharacterId]",
    "Text": "角色ID"
  }
]
```

### 常用数据表

| 表名 | 类型 | 用途 |
|------|------|------|
| `CharacterTable` | `CharacterMB[]` | 角色配置 |
| `EquipmentTable` | `EquipmentMB[]` | 装备配置 |
| `ItemTable` | `ItemMB[]` | 道具配置 |
| `EquipmentCompositeTable` | `EquipmentCompositeMB[]` | 装备碎片配置 |
| `SphereTable` | `SphereMB[]` | 宝石配置 |
| `TreasureChestTable` | `TreasureChestMB[]` | 宝箱配置 |

---

## src/api/generated 使用指南

### 概述

`src/api/generated/` 目录包含从 C# 后端自动生成的 TypeScript 类型定义和 DTO 类。

### 导入方式

```typescript
// 单个类型导入
import { CharacterMB } from '@/api/generated/characterMB';
import { ItemType } from '@/api/generated/itemType';

// 批量导入
export {
    CharacterMB,
    EquipmentMB,
    ItemMB,
    UserItemDtoInfo
} from '@/api/generated';
```

### 常用类型

| 文件 | 类型 | 说明 |
|------|------|------|
| `characterMB.ts` | `CharacterMB` | 角色配置数据 |
| `equipmentMB.ts` | `EquipmentMB` | 装备配置数据 |
| `itemType.ts` | `ItemType` | 道具类型枚举 |
| `userItemDtoInfo.ts` | `UserItemDtoInfo` | 用户持有道具信息 |
| `userStatusDtoInfo.ts` | `UserStatusDtoInfo` | 用户状态信息 |

### 重新生成类型

```bash
pnpm generate-types
```

---

## TimeManager 时间管理器

### 概述

`TimeManager` 用于处理服务器时间与本地时间的差异，确保活动时间计算准确。

### 获取实例

```typescript
import { timeManager } from '@/lib/time-manager';
```

### 常用方法

```typescript
// 设置时区偏移量 (从用户配置或服务器获取)
timeManager.setDiffFromUtc("+09:00:00");

// 获取当前服务器时间 (毫秒)
const serverNowMs = timeManager.getServerNowMs();

// 获取当前服务器时间 (秒)
const serverNowSeconds = timeManager.getServerNowSeconds();

// 格式化时间间隔
const formatted = timeManager.formatTimeSpan(3600000); // "01:00:00"
```

### 使用场景

- 计算活动剩余时间
- 处理限时商店倒计时
- 同步服务器时间相关的业务逻辑

---

## 道具名称解析

### 概述

推荐使用 `useItemName` Hook 自动加载所有需要的 Master 数据表并提供道具名称解析功能。

### 导入方式

```typescript
import { useItemName } from '@/hooks/useItemName';
```

### 使用方式

```typescript
export function ItemDisplay({ itemType, itemId }: { itemType: ItemType; itemId: number }) {
    const { getItemName, isLoading } = useItemName();
    
    return <span>{isLoading ? '加载中...' : getItemName(itemType, itemId)}</span>;
}
```

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `getItemName` | `(itemType: ItemType, itemId: number) => string` | 获取道具名称 |
| `isLoading` | `boolean` | 是否正在加载 |
| `masterTables` | `ItemMasterTables` | 原始 Master 数据表 (按需使用) |
| `t` | `TFunction` | 翻译函数 (按需使用) |

### 支持的道具类型

- 普通道具 (ItemType.CurrencyFree, ItemType.Gold 等)
- 装备 (ItemType.Equipment)
- 装备碎片 (ItemType.EquipmentFragment)
- 角色 (ItemType.Character)
- 角色碎片 (ItemType.CharacterFragment)
- 圣遗物 (ItemType.DungeonBattleRelic)
- 套装材料 (ItemType.EquipmentSetMaterial)
- 宝石 (ItemType.Sphere)
- 宝箱 (ItemType.TreasureChest)
- 套装材料箱 (ItemType.EquipmentSetMaterialBox)

### 获取用户持有数量

使用 `getUserItemCount` 函数获取用户持有道具数量：

```typescript
import { getUserItemCount } from '@/lib/itemUtils';

const count = getUserItemCount(
    userItems,            // 用户道具列表
    ItemType.Gold,        // 道具类型
    0,                    // 道具 ID (0 表示任意)
    false                 // 是否为任意货币类型
);

// 示例: 获取所有货币数量
const allCurrency = getUserItemCount(
    userItems,
    ItemType.CurrencyFree,
    0,
    true  // 同时计算 CurrencyFree 和 CurrencyPaid
);
```

---

## IDA 反编译与函数搜索指南

在进行后端代理层 (`api/MementoMori.Ortega`) 的开发和补全时，我们经常需要借助 IDA 反编译游戏原始代码。

### 搜索特定名称的函数

由于直接使用工具搜索可能会受限，推荐使用以下 Python 片段通过 `mcp_ida-pro-mcp_py_eval` 搜索函数：

```python
import ida_funcs, ida_name
res = []
# 遍历所有已知函数
for i in range(ida_funcs.get_func_qty()):
    f = ida_funcs.getn_func(i)
    if f:
        # 获取函数名称
        name = ida_name.get_name(f.start_ea)
        # 根据名称进行过滤，例如搜索类名或方法名
        if name and "需要搜索的函数或类名" in name:
            res.append({"ea": hex(f.start_ea), "name": name})
res
```

获取到函数的地址 (`ea`) 后，可以使用 `mcp_ida-pro-mcp_decompile` 工具对该地址进行反编译。然后根据反编译的伪代码来实现 `api/MementoMori.Ortega` 中的 C# 逻辑。
