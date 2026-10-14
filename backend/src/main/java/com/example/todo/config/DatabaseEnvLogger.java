package com.example.todo.config;

/**
 * 배포 환경에서 DB 접속 환경변수가 의도대로 들어왔는지 확인하기 위한 진단 로그.
 * 비밀번호는 출력하지 않으며, 사용자명/URL 의 민감한 부분은 마스킹합니다.
 */
public final class DatabaseEnvLogger {

    private DatabaseEnvLogger() {
    }

    public static void log() {
        String url = System.getenv("DB_URL");
        String username = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");

        System.out.println("[DB-ENV] DB_URL      = " + maskUrl(url));
        System.out.println("[DB-ENV] DB_USERNAME = " + maskUsername(username));
        System.out.println("[DB-ENV] DB_PASSWORD = " + (password == null ? "(not set)" : "(set, length " + password.length() + ")"));
    }

    private static String maskUrl(String url) {
        if (url == null) {
            return "(not set)";
        }
        return quote(url
                .replaceAll("//[^/@]*@", "//***@")                  // URL 에 user:password@ 가 들어간 경우
                .replaceAll("(?i)(password=)[^&]*", "$1***"));
    }

    private static String maskUsername(String username) {
        if (username == null) {
            return "(not set)";
        }
        int dot = username.indexOf('.');
        String masked = dot < 0
                ? username
                : username.substring(0, Math.min(username.length(), dot + 5)) + "****";
        return quote(masked) + " (length " + username.length() + ", has tenant suffix: " + (dot >= 0) + ")";
    }

    // 앞뒤 공백이 눈에 보이도록 따옴표로 감쌈
    private static String quote(String value) {
        return "'" + value + "'";
    }
}
