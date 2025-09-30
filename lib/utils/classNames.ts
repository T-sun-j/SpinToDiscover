/**
 * Class Names Utility
 * 类名工具函数
 */

import { cn } from '../utils';

/**
 * 合并多个类名
 * @param classes 类名数组
 * @returns 合并后的类名字符串
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return cn(...classes.filter(Boolean));
}

/**
 * 条件类名
 * @param condition 条件
 * @param trueClass 条件为真时的类名
 * @param falseClass 条件为假时的类名
 * @returns 类名字符串
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string {
  return condition ? trueClass : (falseClass || '');
}

/**
 * 创建响应式类名
 * @param baseClass 基础类名
 * @param responsiveClasses 响应式类名对象
 * @returns 响应式类名字符串
 */
export function responsiveClass(
  baseClass: string,
  responsiveClasses: Record<string, string> = {}
): string {
  const classes = [baseClass];
  
  Object.entries(responsiveClasses).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return classNames(...classes);
}
