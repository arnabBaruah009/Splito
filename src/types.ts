// Group activity types
interface BaseGroupInfo {
  id: string;
  userName: string;
  amount: number;
  type: "borrowed" | "lent";
  date: string;
}

interface BorrowedActivity extends BaseGroupInfo {
  borrowed: number;
  lent?: never;
}

interface LentActivity extends BaseGroupInfo {
  lent: number;
  borrowed?: never;
}

export type ActivityInfo = BorrowedActivity | LentActivity;

// User info type
export type UserInfo = {
  uid: string;
  displayName: string;
  email: string;
  totalLent: number;
  totalBorrowed: number;
  groups: string[];
  expenses: string[];
  friends: string[];
};

// Expense record type
export type Expense = {
  amount: number;
  paidBy: string;
}

// Group Info type
export type GroupInfo = {
  groupName: string;
  createdBy: string;
  summary: Expense[];
  groupSpending: number;
  members: string[];
  totalSpent: number;
  activities: ActivityInfo[]
}

/*user
: 
_UserImpl
accessToken
: 
"eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiWFAiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3BsaXRvLTc5YmQ2IiwiYXVkIjoic3BsaXRvLTc5YmQ2IiwiYXV0aF90aW1lIjoxNzI1ODMzMTIyLCJ1c2VyX2lkIjoib1Zicnh1V2RpYllWNk1selRDUTdpc1ZCOVdYMiIsInN1YiI6Im9WYnJ4dVdkaWJZVjZNbHpUQ1E3aXNWQjlXWDIiLCJpYXQiOjE3MjU4MzMxMjIsImV4cCI6MTcyNTgzNjcyMiwiZW1haWwiOiJhcm5hYkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXJuYWJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.hq3RwpghHS67YZYSa2a1-S3bkqvOCLvd6Uyk_qnACdYnRhPgNTC8pzHbFijslXputa4BubIe5YrhSg3E1SKU9VQNmgDvUNGoNlAJ-lHmtnYOIWDvu0xMusK_pcXR-h3BMc34zl1BDxwy7bE-yB9tgizMweWjslf8u_TOu8msWTPBdpgpwIiI7AwP1u35yR3qDAnMSmmnDnXle0DGCpxLKzUZm7I8-jMTha_JN_Qi3SXAU5gfsomwz8jL16EPdWWXtyN9AGtFQJAzCRz8WKtLaH5mUlB8rgoVL-ehF2Tex6YSjB_fTxgG59G_3T_fJd2azAlcDLe7ZkSwkftxObCtNw"
auth
: 
AuthImpl {app: FirebaseAppImpl, heartbeatServiceProvider: Provider, appCheckServiceProvider: Provider, config: {…}, currentUser: _UserImpl, …}
displayName
: 
"XP"
email
: 
"arnab@gmail.com"
emailVerified
: 
false
isAnonymous
: 
false
metadata
: 
UserMetadata {createdAt: '1725829072568', lastLoginAt: '1725833122584', lastSignInTime: 'Sun, 08 Sep 2024 22:05:22 GMT', creationTime: 'Sun, 08 Sep 2024 20:57:52 GMT'}
phoneNumber
: 
null
photoURL
: 
null
proactiveRefresh
: 
ProactiveRefresh {user: _UserImpl, isRunning: false, timerId: null, errorBackoff: 30000}
providerData
: 
[{…}]
providerId
: 
"firebase"
reloadListener
: 
null
reloadUserInfo
: 
{localId: 'oVbrxuWdibYV6MlzTCQ7isVB9WX2', email: 'arnab@gmail.com', displayName: 'XP', passwordHash: 'UkVEQUNURUQ=', emailVerified: false, …}
stsTokenManager
: 
_StsTokenManager {refreshToken: 'AMf-vByKofDSytSw9NLFgBEL1LXPkEA_JqCDb-I3XXylqGIL0V…M2AiELsBjaqRsAXH_UdrABLltGrsSQ8czeQYReKhuE99knvOA', accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZT…2Tex6YSjB_fTxgG59G_3T_fJd2azAlcDLe7ZkSwkftxObCtNw', expirationTime: 1725836721662}
tenantId
: 
null
uid
: 
"oVbrxuWdibYV6MlzTCQ7isVB9WX2"
*/
