# Ortega API 代理系统使用指南

## 概述

Ortega API 代理系统会自动包装所有来自 `MementoMori.Ortega` 的游戏后端接口，无需为每个接口手动编写代码。

## 工作原理

1. **API 发现**：系统启动时自动扫描所有标记了 `[OrtegaApi]` 特性的 Request 类型
2. **动态路由**：所有 Ortega API 都通过统一的端点访问：`POST /api/ortega/{category}/{action}`
3. **类型生成**：使用 `typegen` 从 C# 代码自动生成 TypeScript 类型定义

## 前端调用方式

### 方式一：使用类型安全的辅助函数（推荐）

```typescript
import ortegaApi from '@/api/ortega-client';

// User API 示例
const userData = await ortegaApi.user.getUserData();
const mypageData = await ortegaApi.user.getMypage();

// Mission API 示例
import { GetMissionInfoRequest } from '@/api/generated';

const missionInfo = await ortegaApi.mission.getMissionInfo({
  targetMissionGroupList: [/* ... */]
} as GetMissionInfoRequest);

// Shop API 示例
const shopList = await ortegaApi.shop.getList();
```

### 方式二：使用通用调用函数

```typescript
import { callOrtegaApi } from '@/api/ortega-client';
import type { GetUserDataRequest, GetUserDataResponse } from '@/api/generated';

const response = await callOrtegaApi<GetUserDataRequest, GetUserDataResponse>(
  'user',
  'getUserData',
  {} // 请求参数
);
```

### 方式三：直接使用 axios

```typescript
import apiClient from '@/api/axios-client';
import type { GetMissionInfoRequest, GetMissionInfoResponse } from '@/api/generated';

const request: GetMissionInfoRequest = {
  targetMissionGroupList: [/* ... */]
};

const response = await apiClient.post<GetMissionInfoResponse>(
  '/api/ortega/mission/getMissionInfo',
  request
);
```

## 生成 TypeScript 类型

运行以下命令生成所有 Ortega API 的 TypeScript 类型定义：

```bash
cd api/MementoMori.Api
pnpm run generate-types
```

这将在 `src/api/generated/` 目录下生成所有的类型文件，包括：
- 所有 Ortega Request 类型（如 `getUserDataRequest.ts`）
- 所有 Ortega Response 类型（如 `getUserDataResponse.ts`）
- 相关的枚举和数据类型

## 可用的 API 列表

可以通过以下端点查看所有可用的 Ortega API：

```typescript
import { getOrtegaApiList } from '@/api/ortega-client';

const apiList = await getOrtegaApiList();
console.log(`总共有 ${apiList.total} 个 API`);
console.log(apiList.apis);
```

或者直接访问：`GET http://localhost:5000/api/ortega/list`

## 路由格式

所有 Ortega API 遵循统一的路由格式：

```
POST /api/ortega/{category}/{action}
```

**示例**：
- `POST /api/ortega/user/getUserData` - 获取用户数据
- `POST /api/ortega/mission/getMissionInfo` - 获取任务信息
- `POST /api/ortega/shop/getList` - 获取商店列表
- `POST /api/ortega/battle/pvpStart` - 开始 PVP 战斗

## 认证

所有请求都需要在 Header 中包含 `X-User-Id`，这个会由 `axios-client` 的拦截器自动添加。

## 错误处理

代理系统会统一处理 Ortega API 错误：

```typescript
try {
  const userData = await ortegaApi.user.getUserData();
} catch (error) {
  if (error.response?.status === 400) {
    // Ortega API 错误
    console.error('API Error:', error.response.data);
  } else if (error.response?.status === 401) {
    // 认证错误，会自动重定向到账户管理页面
  }
}
```

## 添加新的快捷方法

如果你想为某个 Ortega API 添加快捷方法，编辑 `src/api/ortega-client.ts`：

```typescript
export const ortegaApi = {
  // ... 现有的快捷方法
  
  // 添加新的分类
  gacha: {
    exec: (request: any) =>
      callOrtegaApi('gacha', 'exec', request),
    getGachaSelectListInfo: (request = {}) =>
      callOrtegaApi('gacha', 'getGachaSelectListInfo', request),
  },
};
```

## 注意事项

1. **类型生成**：每次修改 Ortega 相关的 C# 代码后，记得运行 `pnpm run generate-types`
2. **空请求**：如果接口不需要请求参数，可以传递空对象 `{}`
3. **异步调用**：所有 API 调用都是异步的，记得使用 `await` 或者 `.then()`
4. **错误处理**：务必添加适当的错误处理逻辑

## 完整示例

```typescript
import { useEffect, useState } from 'react';
import ortegaApi from '@/api/ortega-client';
import type { GetMissionInfoRequest, GetMissionInfoResponse } from '@/api/generated';

function MissionsPage() {
  const [missionInfo, setMissionInfo] = useState<GetMissionInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMissions() {
      try {
        setLoading(true);
        
        const request: GetMissionInfoRequest = {
          targetMissionGroupList: [/* 填入需要的参数 */]
        };
        
        const response = await ortegaApi.mission.getMissionInfo(request);
        setMissionInfo(response);
      } catch (error) {
        console.error('Failed to load missions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!missionInfo) return <div>No data</div>;

  return (
    <div>
      {/* 渲染任务信息 */}
    </div>
  );
}
```
