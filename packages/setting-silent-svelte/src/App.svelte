<script>
import QueueConsole from "./lib/QueueConsole.svelte";
import List, { Item, Meta, Label, Text } from '@smui/list';
import Switch from '@smui/switch';
import Menu from '@smui/menu';
import MenuSurface from '@smui/menu-surface';
import Textfield from '@smui/textfield';
import Button from '@smui/button';
import { filterSilentMethods, useSQRequest } from "@alova/scene-svelte";
import { getSettings, updateSetting } from "./api";
import { currentMode, silentConfig } from "./config";
import CircularProgress from '@smui/circular-progress';

let menu;
let surface;
const { data: settingData, loading, onSuccess } = useSQRequest(getSettings, {
  behavior: () => currentMode.value() === 0 ? 'queue' : 'static',
  initialData: {
    textContent: ''
  }
});
let textContent = '';

// 补全未提交的数据
const fillSilentMethodsData = () => {
  const smAry = filterSilentMethods();
  smAry.forEach(smItem => {
    if (!smItem.reviewData) {
      return;
    }
    const { name, value } = smItem.reviewData;
    $settingData[name] = value;
  });
};
settingData.subscribe(() => {
  setTimeout(fillSilentMethodsData);
});
onSuccess(({ data }) => {
  textContent = data.textContent;
  fillSilentMethodsData();
});

const { send: submitData, loading: submiting, onSuccess: onSubmitSuccess } = useSQRequest((name, value) => updateSetting(name, value), {
  ...silentConfig,
  immediate: false,
});
onSubmitSuccess(({ silentMethod, sendArgs: [name, value] }) => {
  $settingData[name] = value;
  if (silentMethod) {
    silentMethod.reviewData = { name, value };
    silentMethod.save();
  }
});


</script>

<div class="wrapper">
  <div class="main">
    {#if $loading || $submiting}
      <div class="loading-bar">
        <CircularProgress style="height: 16px; width: 16px;" indeterminate />
      </div>
    {/if}
    <List checkList>
      <Item>
        <Label>开关1</Label>
        <Meta>
          <Switch checked={$settingData.checkbox1} on:SMUISwitch:change={({ detail }) => submitData('checkbox1', detail.selected)} />
        </Meta>
      </Item>
      <Item>
        <Label>开关2</Label>
        <Meta>
          <Switch checked={$settingData.checkbox2} on:SMUISwitch:change={({ detail }) => submitData('checkbox2', detail.selected)} />
        </Meta>
      </Item>
      <Item on:click={() => menu.setOpen(true)}>
        <Label>选项1</Label>
        <Meta>
          <Text>{$settingData.selectedMenu1 || '请选择'}</Text>
        </Meta>
      </Item>
      <Item on:click={() => surface.setOpen(true)}>
        <Label>文本1</Label>
        <Meta>
          <Text>{$settingData.textContent || '请输入'}</Text>
        </Meta>
      </Item>
    </List>
  </div>
  <Menu bind:this={menu}>
    <List>
      <Item on:SMUI:action={() => submitData('selectedMenu1', 'A')}>
        <Text>A</Text>
      </Item>
      <Item on:SMUI:action={() => submitData('selectedMenu1', 'B')}>
        <Text>B</Text>
      </Item>
      <Item on:SMUI:action={() => submitData('selectedMenu1', 'C')}>
        <Text>C</Text>
      </Item>
      <Item on:SMUI:action={() => submitData('selectedMenu1', 'D')}>
        <Text>D</Text>
      </Item>
    </List>
  </Menu>

  <MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT">
    <div style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;">
      <Textfield bind:value={textContent} label="内容" />
      <Button style="margin-top: 1em;" on:click={() => {
        submitData('textContent', textContent);
        surface.setOpen(false);
      }}>
        提交
      </Button>
    </div>
  </MenuSurface>

  <QueueConsole></QueueConsole>
</div>

<style>
.wrapper {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.main {
  width: 375px;
  border: solid 1px #d4d4d4;
  position: relative;
}
.loading-bar {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>