### Stack

-   Nest.js(typescript)
-   Postgresql(Prisma)

### Setup

**_주의 :_** 도커 엔진이 데몬 상태인 유닉스 계열의 운영체제여야 합니다.(tmp 디렉터리, bash 쉘 활용)

프로젝트 클론<br>
`$ git clone https://github.com/maaaaaaaaad/sssss.git`

프로젝트 루트 디렉터리의 provisioning.sh 권한 부여<br>
`$ chmod +x ./provisioning.sh`

provisioning.sh 실행<br>
`$ ./provisioning.sh`

### Provisioning 쉘 스크립트 설명

쉘 스크립트를 실행하면 사용자로부터 DB 이름과 DB 비밀번호를 입력 받습니다.

사용자로부터 받은 변수들과 함께 쉘 스크립트는 psql을 도커라이징 합니다.

필요한 모듈 (npm ci, npx prisma migration 등)들을 자동으로 마운트합니다.

쉘 스크립트는 23개의 unit(mock) test를 자동으로 실행합니다.

쉘 스크립트는 11개의 e2e test를 자동으로 실행합니다.

쉘 스크립트는 어드민 계정과 일반 사용자 계정 둘을 자동으로 생성하고 members table에 자동으로 적재합니다.

모든 과정은 터미널 로그를 통해 확인할 수 있으며, 마지막 부분에 어드민 계정과 일반 사용자 계정에 대한 이메일 및 비밀번호가 있습니다. 사용하시면 됩니다.

### Execute

서버 실행<br>
`$ npm run start:dev`

쉘 스크립트 진행이 완료되면 서버를 실행합니다. 도커라이징 된 DB 컨테이너와 자동으로 연결이 되어 있습니다.

서버 실행 로그를 확인하면 마지막에 스웨거 url이 있습니다. (API 명세를 확인할 수 있습니다)

**_주의 :_** 따로 e2e 테스트를 실행하면 table record가 비워집니다.
