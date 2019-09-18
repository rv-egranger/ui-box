import test from "ava";
import * as cache from "../src/cache";
import * as styles from "../src/styles";
import enhanceProps from "../src/enhance-props";

test.afterEach.always(() => {
  cache.clear();
  styles.clear();
});

test.serial("enhances a prop", t => {
  const { className, enhancedProps } = enhanceProps({ width: 10 });
  t.is(className, "ui_box_w_10px");
  t.deepEqual(enhancedProps, {});
});

test.serial("expands aliases", t => {
  const { className, enhancedProps } = enhanceProps({ margin: 11 });
  t.is(
    className,
    "ui_box_mb_11px ui_box_ml_11px ui_box_mr_11px ui_box_mt_11px"
  );
  t.deepEqual(enhancedProps, {});
});

test.serial("injects styles", t => {
  enhanceProps({ width: 12 });
  t.is(
    styles.getAll(),
    `
.ui_box_w_12px {
  width: 12px;
}`
  );
});

test.serial("uses the cache", t => {
  enhanceProps({ width: 13 });
  enhanceProps({ width: 13 });
  t.is(
    styles.getAll(),
    `
.ui_box_w_13px {
  width: 13px;
}`
  );
  t.is(cache.get("width", 13), "ui_box_w_13px");
});

test.serial("strips falsey enhancer props", t => {
  const { className, enhancedProps } = enhanceProps({ width: false });
  t.is(className, "");
  t.deepEqual(enhancedProps, {});
});

test.serial("does not strip enhancer props with 0 values", t => {
  const { className, enhancedProps } = enhanceProps({ width: 0 });
  t.is(className, "ui_box_w_0px");
  t.deepEqual(enhancedProps, {});
});

test.serial("passes through non-enhancer props", t => {
  const { className, enhancedProps } = enhanceProps({ disabled: true });
  t.is(className, "");
  t.deepEqual(enhancedProps, { disabled: true });
});

test.serial("passes through falsey non-enhancer props", t => {
  const { className, enhancedProps } = enhanceProps({ disabled: false });
  t.is(className, "");
  t.deepEqual(enhancedProps, { disabled: false });
});

test.serial("handles invalid values", t => {
  const { className, enhancedProps } = enhanceProps({ minWidth: true });
  t.is(className, "");
  t.deepEqual(enhancedProps, {});
});
