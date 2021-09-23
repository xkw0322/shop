<template>
  <div>
    <!-- 导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <el-row>
            <el-col>
              <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
            </el-col>
          </el-row>
          <!-- 角色列表区域 -->
          <el-table :data="roleList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row :class="['vcenter','rowMargin','bdbottom', index1 === 0 ? 'bdtop' : '']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                  <!-- 一级权限 -->
                  <el-col :span="5" :class="'icenter'">
                    <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 二级权限 -->
                    <el-row :class="['vcenter',index2 === 0 ? '' : 'bdtop']" v-for="(item2, index2) in item1.children" :key="item2.id">
                      <el-col :span="6" :class="'icenter'">
                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <!-- 三级权限 -->
                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item2.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRole(scope.row.id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
          </el-table>
      </el-card>
      <!-- 分配权限的对话框 -->
      <el-dialog
       title="提示"
       :visible.sync="setRightDialogVisible"
       width="50%"
       @close="setRightialogClosed">
       <!-- 树形控件 -->
       <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
       <span slot="footer" class="dialog-footer">
       <el-button @click="setRightDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="allotRights">确 定</el-button>
       </span>
      </el-dialog>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        @close="addRoleDialogClosed">
        <el-form :model="addForm" :rules="addRoleRules" ref="addRoleRef" label-width="80px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        @click="editRoleDialogClosed">
        <el-form :model="editForm" :rules="addRoleRules" ref="editRoleRef" label-width="80px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值
      defKeys: [],
      // 将要分配权限的角色id
      roleId: '',
      // 控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 控制编辑角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 添加表单的验证规则对象
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名在2到10个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 20, message: '角色描述在2到20个字符', trigger: 'blur' }
        ]
      },
      // 添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 需要编辑的角色信息对象
      editForm: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      } else {
        this.roleList = res.data
      }
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      } else {
        const { data: res } = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        } else {
          role.children = res.data
        }
      }
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败！')
      } else {
        this.rightsList = res.data
        // 递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      }
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到deKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => this.getLeafKeys(item, arr))
      }
    },
    setRightialogClosed () {
      // 关闭分配权限对话框时，清空defKeys数组
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      } else {
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    },
    // 点击添加角色
    async addRole () {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('roles', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        } else {
          this.$message.success('添加角色成功！')
          this.addRoleDialogVisible = false
          this.getRolesList()
        }
      })
    },
    // 监听添加角色对话框的关闭事件
    addRoleDialogClosed () {
      this.$refs.addRoleRef.resetFields()
    },
    // 监听修改角色对话框的关闭事件
    editRoleDialogClosed () {
      this.$refs.editRoleRef.resetFields()
    },
    // 展示编辑角色对话框
    async showEditRole (id) {
      const { data: res } = await this.axios.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      } else {
        this.editForm = res.data
        console.log(this.editForm)
      }
      this.editRoleDialogVisible = true
    },
    // 修改角色信息并提交
    editRole () {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put(`roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色数据失败！')
        } else {
          this.editRoleDialogVisible = false
          this.getRolesList()
          this.$message.success('更新角色信息成功！')
        }
      })
    },
    // 删除角色信息
    async removeRole (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认删除 返回confirm 取消删除 返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.axios.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        } else {
          this.$message.success('删除角色成功！')
          this.getRolesList()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.rowMargin {
  margin: 0 50px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.icenter {
  display: flex;
  align-items: center;
}
</style>
