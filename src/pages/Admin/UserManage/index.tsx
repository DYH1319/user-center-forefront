import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from "@ant-design/pro-components";
import {Button, Image, message, Modal} from 'antd';
import {useRef} from 'react';
import {deleteUser, searchUsers, updateUser} from "@/services/ant-design-pro/api";
import {isEqual} from "lodash";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
    editable: false
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    hideInSearch: true,
    // ellipsis: true,
    // copyable: true,
    render: (_, entity) => (
      <div>
        <Image src={entity.avatarUrl} height={90}/>
      </div>
    )
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '女'
      },
      1: {
        text: '男'
      },
      2: {
        text: '未指定'
      }
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '正常',
        status: 'Success'
      },
    },
  },
  {
    title: '身份',
    dataIndex: 'userRole',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '普通用户',
        color: '#4b4747'
      },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
    editable: false
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: "dateTimeRange",
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable(record.id.toString());
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <a
        key={"delete"}
        style={{color: 'red'}}
        onClick={() => {
          Modal.confirm({
            title: '删除用户',
            content: '确定删除该用户吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              try {
                const result = await deleteUser(record.id);
                // @ts-ignore
                if (result && result === true) {
                  action?.reload()
                  return Promise.resolve()
                } else {
                  throw new Error();
                }
              } catch (error) {
                message.error('删除失败，请重试！');
                return Promise.reject()
              }
            },
          });
        }}
      >
        删除
      </a>
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        // console.log(params)
        console.log(sort, filter);
        await waitTime(2000);
        const userList = await searchUsers(params);
        return {
          data: userList
        }
        // return request<{
        //   data: CurrentUser[];
        // }>('https://proapi.azurewebsites.net/github/issues', {
        //   params,
        // });
      }}
      editable={{
        type: 'single',
        onSave: async (id, record, originRow) => {
          if (isEqual(record, originRow)) return
          try {
            const result = await updateUser(record);
            // @ts-ignore
            if (result && result === true) {
              actionRef.current?.reload()
              return Promise.resolve()
            } else {
              throw new Error();
            }
          } catch (error) {
            message.error('保存失败，请重试！');
            return Promise.reject()
          }
        },
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              createTime: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户管理"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined/>}
          onClick={() => {

          }}
          type="primary"
        >
          新建
        </Button>
      ]}
    />
  );
};
