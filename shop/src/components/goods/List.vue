<template>
  <div>
    <!-- 导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 视图区域 -->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="goAddpage">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="180px">
              <template v-slot:default="scope">
                {{scope.row.add_time | dateFormat}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template v-slot:default="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
        </el-pagination>
      </el-card>
      <!-- 修改对话框 -->
    <el-dialog
        title="修改商品信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" type="number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.axios.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      } else {
        // this.$message.success('商品列表获取成功！')
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      } else {
        const { data: res } = await this.axios.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        } else {
          this.$message.success('删除成功！')
          this.getGoodsList()
        }
      }
    },
    goAddpage () {
      this.$router.push('/goods/add')
    },
    // 展示修改对话框
    async showEditDialog (id) {
      const { data: res } = await this.axios.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('获取商品数据失败！')
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
        // console.log(this.editForm)
        // console.log(id)
      }
    },
    // 关闭对话框时触发
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮。修改信息
    editGoods () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put(`goods/${this.editForm.goods_id}`, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
          goods_introduce: this.editForm.goods_introduce,
          goods_cat: this.editForm.goods_cat,
          pics: this.editForm.pics,
          attrs: this.editForm.attrs
        })
        if (res.meta.status !== 200) {
          console.log(res)
          return this.$message.error('修改参数失败！')
        } else {
          this.$message.success('修改参数成功！')
          this.getGoodsList()
          this.editDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
