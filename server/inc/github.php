<?php
// Публикация в репозиторий сайта через GitHub API. После коммита GitHub Actions сам собирает сайт и выкладывает его на REG.RU.
if (!defined('ORTO')) { http_response_code(404); exit; }

function gh($method, $path, $body = null)
{
    $repo = cfg('github_repo');
    $headers = [
        'Authorization: Bearer ' . cfg('github_token'),
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: orto-blog-bot',
        'Content-Type: application/json',
    ];
    list($code, $res) = http_req($method, "https://api.github.com/repos/$repo/$path",
        $body === null ? null : json_encode($body, JSON_UNESCAPED_UNICODE), $headers, 30);
    return [$code, json_decode($res, true)];
}

function gh_branch()
{
    return cfg('github_branch') ?: 'main';
}

function gh_exists($path)
{
    list($code) = gh('GET', 'contents/' . $path . '?ref=' . gh_branch());
    return $code === 200;
}

function gh_file($path)
{
    list($code, $j) = gh('GET', 'contents/' . $path . '?ref=' . gh_branch());
    if ($code !== 200 || !isset($j['content'])) return null;
    return base64_decode($j['content']);
}

// $files: путь => содержимое (строка) или null (удалить). Один коммит на все файлы.
function gh_commit($message, $files)
{
    $br = gh_branch();
    for ($try = 0; $try < 3; $try++) {
        list($c, $ref) = gh('GET', "git/ref/heads/$br");
        if ($c !== 200) throw new Exception("github ref $c");
        $head = $ref['object']['sha'];
        list($c, $cm) = gh('GET', "git/commits/$head");
        if ($c !== 200) throw new Exception("github commit $c");
        $tree = [];
        foreach ($files as $path => $content) {
            if ($content === null) {
                $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => null];
                continue;
            }
            list($c, $b) = gh('POST', 'git/blobs', ['content' => base64_encode($content), 'encoding' => 'base64']);
            if ($c !== 201) throw new Exception("github blob $c");
            $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => $b['sha']];
        }
        list($c, $t) = gh('POST', 'git/trees', ['base_tree' => $cm['tree']['sha'], 'tree' => $tree]);
        if ($c !== 201) throw new Exception("github tree $c");
        list($c, $n) = gh('POST', 'git/commits', ['message' => $message, 'tree' => $t['sha'], 'parents' => [$head]]);
        if ($c !== 201) throw new Exception("github new commit $c");
        list($c) = gh('PATCH', "git/refs/heads/$br", ['sha' => $n['sha']]);
        if ($c === 200) return true;
        // 422 — за это время в ветку попал другой коммит: повторяем поверх нового
        if ($c !== 422) throw new Exception("github update ref $c");
    }
    throw new Exception('github: ветка занята, попробуйте ещё раз');
}
