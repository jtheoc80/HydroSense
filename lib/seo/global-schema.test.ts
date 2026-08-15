import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGlobalServiceDescription,
  getSupportedDeviceNames,
} from "../../components/Schema";
import { deviceList } from "../devices";

test("global Service schema derives every supported device name from deviceList", () => {
  const expectedNames = deviceList.map((device) => device.name);
  const description = buildGlobalServiceDescription();

  assert.deepEqual(getSupportedDeviceNames(), expectedNames);
  for (const name of expectedNames) {
    assert.match(description, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(description, /domestic-water monitoring and automatic shutoff systems/i);
});
