<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="分配角色" width="500px">
    <BasicDrawer
      v-if="roleTree.length"
      checkable
      defaultExpandAll
      :treeData="roleTree"
      :fieldNames="replaceFields"
      :checkedKeys="checkedKeys"
      @check="platformRoleChange"
    />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Tree as Trees } from 'ant-design-vue';
  import { tree } from '/@/api/platformRole';
  import {
    listPlatformRoleIdByUserId,
    createUserPlatformRole,
    deleteUserPlatformRole,
  } from '/@/api/userPlatformRole';

  let userId = '';
  const roleTree = ref([]);
  const checkedKeys = ref<string[]>([]);
  const replaceFields = {
    children: 'children',
    title: 'name',
    key: 'id',
  };

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    userId = data.id;
    setDrawerProps({ loading: true });
    try {
      roleTree.value = await tree();
      roleTree.value.forEach((platformRole) => {
        platformRole.disableCheckbox = true;
      });
      checkedKeys.value = await listPlatformRoleIdByUserId(userId);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  async function platformRoleChange(_, e) {
    const data = {
      userId,
      platformRoleId: e.node.id,
    };

    try {
      if (e.checked) {
        await createUserPlatformRole(data);
      } else {
        await deleteUserPlatformRole(data);
      }
    } catch (e) {
      // 失败时还原勾选
    }
  }
</script>
