/**
 * 地理位置工具函数
 * Geolocation utility functions
 */

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * 获取用户当前位置
 * @param options 地理位置选项
 * @returns Promise<GeolocationPosition>
 */
export function getCurrentPosition(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5分钟缓存
  }
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: -1,
        message: '浏览器不支持地理位置功能'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = '获取地理位置失败';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了地理位置请求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '地理位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '获取地理位置超时';
            break;
          default:
            errorMessage = '获取地理位置时发生未知错误';
            break;
        }

        reject({
          code: error.code,
          message: errorMessage
        });
      },
      options
    );
  });
}

/**
 * 将坐标转换为地址描述
 * @param latitude 纬度
 * @param longitude 经度
 * @returns Promise<string>
 */
export async function reverseGeocode(
  latitude: number, 
  longitude: number
): Promise<string> {
  try {
    // 使用浏览器内置的地理编码API（如果可用）
    if ('geolocation' in navigator && 'reverseGeocode' in navigator) {
      // 某些浏览器可能支持，但大多数不支持
      throw new Error('浏览器不支持反向地理编码');
    }

    // 使用第三方地理编码服务（这里使用一个简单的示例）
    // 在实际项目中，你可能需要使用Google Maps API、百度地图API等
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`
    );
    
    if (!response.ok) {
      throw new Error('地理编码服务不可用');
    }

    const data = await response.json();
    
    // 构建地址字符串
    const addressParts = [];
    if (data.locality) addressParts.push(data.locality);
    if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
    if (data.countryName) addressParts.push(data.countryName);
    
    return addressParts.join('，') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    // 如果地理编码失败，返回坐标
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

/**
 * 获取用户位置并转换为地址
 * @param options 地理位置选项
 * @returns Promise<string>
 */
export async function getCurrentLocationString(
  options?: PositionOptions
): Promise<string> {
  try {
    const position = await getCurrentPosition(options);
    const address = await reverseGeocode(position.latitude, position.longitude);
    return address;
  } catch (error) {
    // 如果获取位置失败，返回默认位置
    console.warn('获取地理位置失败，使用默认位置:', error);
    return '中国，北京';
  }
}

/**
 * 检查地理位置权限状态
 * @returns Promise<PermissionState>
 */
export async function checkGeolocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return permission.state;
  } catch (error) {
    return 'prompt';
  }
}
