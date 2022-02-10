import Vue from 'vue'

import { Input, Breadcrumb,Card, BreadcrumbItem, Form, FormItem, Upload, Button, Select, Option, DatePicker, Tabs, TabPane, Drawer, Pagination, Row, Col, Message, Progress, MessageBox, Image } from 'element-ui'

Vue.use(Input)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Form)
  .use(FormItem)
  .use(Button)
  .use(Upload)
  .use(Select)
  .use(Option)
  .use(DatePicker)
  .use(Tabs)
  .use(TabPane)
  .use(Drawer)
  .use(Pagination)
  .use(Row)
  .use(Col)
  .use(Progress)
  .use(Image)
    .use(Card)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
