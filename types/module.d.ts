/**
 * 引入的一些模块的类型定义
 */
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module "ant-design-vue/es/locale/*" {
  import { Locale } from "ant-design-vue/types/locale-provider";
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

declare module "moment/dist/locale/*" {
  import { LocaleSpecification } from "moment";
  const locale: LocaleSpecification & ReadonlyRecordable;
  export default locale;
}
