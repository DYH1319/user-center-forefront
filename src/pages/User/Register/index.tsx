import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, Link} from 'umi';
import styles from './index.less';
import {STEAM_STORE, SYSTEM_LOGO} from "@/constants";
import {RuleObject, StoreValue} from "rc-field-form/lib/interface";

const Register: React.FC = () => {
  // let checkSymbol: number = 0; // 限制只能单向校验两次密码输入是否相同，避免死循环
  const [type, setType] = useState<string>('account');
  // const [form] = ProForm.useForm();

  const handleSubmit = async (values: API.RegisterParams) => {
    const {userPassword, checkPassword} = values;
    // 校验
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    try {
      // 注册
      const id = await register({
        ...values,
        type,
      });
      if (id) {
        // const defaultLoginSuccessMessage = '注册成功！';
        // message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        history.push({
          pathname: '/user/login',
          query
        });
        return;
      }
    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO}/>}
          title="Steam用户中心"
          subTitle={<a href={STEAM_STORE} target={"_blank"}
                       rel="noreferrer">Steam用户中心是国区最具影响力的 <strong>Steam用户</strong> 平台</a>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码注册'}/>
          </Tabs>
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号必须不少于4位！'
                  },
                  {
                    max: 8,
                    type: 'string',
                    message: '账号必须不大于8位！'
                  },
                  {
                    pattern: new RegExp('^[A-Za-z0-9_-]+$'),
                    type: 'string',
                    message: '账号只能包含大小写字母、阿拉伯数字、下划线以及短横线！'
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 6,
                    type: 'string',
                    message: '密码必须不少于6位！'
                  },
                  {
                    max: 16,
                    type: 'string',
                    message: '密码必须不大于16位！'
                  },
                  {
                    pattern: new RegExp('^[A-Za-z0-9!@#$%^&*<>?_-]+$'),
                    type: 'string',
                    message: '密码只能包含大小写字母、阿拉伯数字以及下列符号:\n!@#$%^&*<>?_-'
                  },
                  // ({getFieldValue, validateFields}) => ({
                  //   validator(rule: RuleObject, value: StoreValue) {
                  //     if (checkSymbol === 0) {
                  //       checkSymbol++
                  //       validateFields(['checkPassword'])
                  //     } else {
                  //       checkSymbol--
                  //     }
                  //     if (value !== getFieldValue('checkPassword')) {
                  //       return Promise.reject('两次输入的密码不一致！')
                  //     }
                  //     return Promise.resolve()
                  //   },
                  //   message: '两次输入的密码不一致！'
                  // }),
                  ({}) => ({
                    validator(rule: RuleObject, value: StoreValue) {
                      if (value === undefined) {
                        return Promise.resolve()
                      }
                      let count = 0
                      count = new RegExp('[A-Z]').test(value) ? count + 1 : count
                      count = new RegExp('[a-z]').test(value) ? count + 1 : count
                      count = new RegExp('[0-9]').test(value) ? count + 1 : count
                      count = new RegExp('[!@#$%^&*<>?_-]').test(value) ? count + 1 : count
                      if (count < 2) {
                        return Promise.reject('密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！')
                      }
                      return Promise.resolve()
                    },
                    message: '密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！'
                  }),
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min: 6,
                    type: 'string',
                    message: '确认密码必须不少于6位！'
                  },
                  {
                    max: 16,
                    type: 'string',
                    message: '确认密码必须不大于16位！'
                  },
                  {
                    pattern: new RegExp('^[A-Za-z0-9!@#$%^&*<>?_-]+$'),
                    type: 'string',
                    message: '密码只能包含大小写字母、阿拉伯数字以及下列符号:\n!@#$%^&*<>?_-'
                  },
                  // ({getFieldValue, validateFields}) => ({
                  //   validator(rule: RuleObject, value: StoreValue) {
                  //     if (checkSymbol === 0) {
                  //       checkSymbol++
                  //       validateFields(['userPassword'])
                  //     } else {
                  //       checkSymbol--
                  //     }
                  //     if (value !== getFieldValue('userPassword')) {
                  //       return Promise.reject('两次输入的密码不一致！')
                  //     }
                  //     return Promise.resolve()
                  //   },
                  //   message: '两次输入的密码不一致！',
                  // }),
                  ({}) => ({
                    validator(rule: RuleObject, value: StoreValue) {
                      if (value === undefined) {
                        return Promise.resolve()
                      }
                      let count = 0
                      count = new RegExp('[A-Z]').test(value) ? count + 1 : count
                      count = new RegExp('[a-z]').test(value) ? count + 1 : count
                      count = new RegExp('[0-9]').test(value) ? count + 1 : count
                      count = new RegExp('[!@#$%^&*<>?_-]').test(value) ? count + 1 : count
                      if (count < 2) {
                        return Promise.reject('密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！')
                      }
                      return Promise.resolve()
                    },
                    message: '密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！'
                  }),
                ]}
              />
            </>
          )}
          <Link
            style={{
              float: 'right',
              marginBottom: 24
            }}
            to={"/user/login"}
          >
            已有账号？立即登录
          </Link>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
