export const elements ={ //节点
  "Attributes": [],
  "Ci": {
    "CiGuid": 0,
    "CiType": 0,
    "CiViewId": 0,
    "Description": "",
    "Id": 0,
    NameCn:'自定义节点',
    "IdAdmTenement": 0,
    "InstanceTableName": "",
    "IsReference": 0,
    "Name": "",
    "ReferenceCiId": 0,
    "TableStatus": "0"
  }
};

export const Attributes = { //属性
  "ColumnName": "",
  "ColumnType": "varchar",
  "Description": "",
  "DisplaySeqNo": 0,
  "DisplayType": "Input",
  "Id": 0,
  "IdAdmCiType": 0,
  "InputType": "0",
  "IsDeleted": "0",
  "IsEditable": "0",
  "IsHiden": "0",
  "IsNull": "0",
  "IsOnly": "0",
  "Length": 128,
  "Name": "自定义属性",
  "ReferenceCiTypeId": 0,
  "ReferenceId": 0,
  "SearchSeqNo": 0,
  "Status": 0
}

export const ciEdge = { //线条
  "CiViewId": 0,
  "Id": 0,
  "Name": "",
  "ReferenceType": "",
  "SrcCiTypeId": 0,
  "TarCiTypeId": 0,
  "Title": "自定义线条"
};

export const normalTypeOptions = [{
  label: '自定义',
  icon: 'thunder.png',
}, {
  label: '引用',
  icon: 'fire.png',
},];

export const ColumnType = [{
  value: 'varchar',
  label: '字符串'
},{
  value: 'int',
  label: '整型'
},{
  value: 'boolean',
  label: '布尔类型'
},{
  value: 'float',
  label: '浮点型'
},{
  value: 'array',
  label: '数组'
},{
  value: 'date',
  label: '时间'
},{
  value: 'reference',
  label: '引用'
}]

export const DisplayType = [{
  value: 'Radio',
  label: '单选框'
},{
  value: 'Checkbox',
  label: '多选框'
},{
  value: 'Input',
  label: '输入框'
},{
  value: 'InputNumber',
  label: '计数器'
},{
  value: 'Select',
  label: '选择器'
},{
  value: 'Cascader',
  label: '级联选择器'
},{
  value: 'Switch',
  label: '开关'
},{
  value: 'Slider',
  label: '滑块'
},{
  value: 'TimePicker',
  label: '时间选择器'
},{
  value: 'DatePicker',
  label: '日期选择器'
},{
  value: 'DateTimePicker',
  label: '日期时间选择器'
},{
  value: 'Upload',
  label: '上传'
},{
  value: 'ColorPicker',
  label: '颜色选择器'
},{
  value: 'Transfer',
  label: '穿梭框'
}]


