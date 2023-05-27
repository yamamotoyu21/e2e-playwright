- 目的
    - テスト練習
        - data driven testing
            - happy path
            - validation
                - tips
                    https://playwright.dev/docs/test-parameterize
                    https://github.com/ortoniKC/Playwright-Test-Runner/blob/main/parameterized-test/computerDB.test.ts
        - how to handle credentials

        - select box
        - Date Picker
    - 対象
        - hotel.testplanisphere
         - 'https://hotel.testplanisphere.dev/ja/signup.html'
    - テストケース
        - バリデーション
            - メールアドレス
                - null
                - スペース
                - メールアドレス形式以外
                - alphabet以外
                - 登録済みのメールアドレス
            - パスワード
                - null
                - スペース
                - 7文字以内
                - アルファベット以外
                - 記号
            - 確認用パスワード
                - null
                - スペース
                - 7文字以内
                - 異なるパスワード
            - 氏名
                - null
                - スペース
            - 会員クラス
                - プラミアム
                - 一般会員
            ー 住所
                - null
                - 番地なし
            - 電話番号
                - null
                - スペース
                - 数字以外
                - 登録済み
                - 10桁
                - 12桁
            - 性別
                - 回答しない
                - 男性
                - 女性
                - その他
            - 生年月日
                - 未選択
                - 日選択
                - 月選択
                - 上へ移動して選択
                - 上へ移動後、下へ移動して選択
                - 未来の日付
                - 入力後、クリア
                - today
            - お知らせを受け取る
                - チェックなし
                - チェックあり
            - 登録
                - disabled
                - enabled
        - happy path
    - ページオブジェクト
        - メールアドレス入力欄
        - パスワード入力欄
        - 氏名入力欄
        - 会員種別選択
            - プレミアム
            - 一般
        - 住所入力欄
        - 電話番号
        - 性別
        - 生年月日
        - お知らせ受け取り
        - 登録
    



            