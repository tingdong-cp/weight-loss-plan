import {useState, useEffect} from 'react';
import Head from 'next/head';
import {
    planConfig,
    stats,
    progress,
    schedule,
    nutrition,
    phases,
    tips,
} from '../config';

const tagStyle = {
    cardio: {backgroundColor: '#E1F5EE', color: '#0F6E56'},
    strength: {backgroundColor: '#EEEDFE', color: '#534AB7'},
    rest: {backgroundColor: '#F1EFE8', color: '#5F5E5A'},
};

function Bar({pct, color}) {
    return (
        <div
            style={{
                background: '#F1EFE8',
                borderRadius: 99,
                height: 6,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: color,
                    borderRadius: 99,
                }}
            />
        </div>
    );
}

function SectionLabel({children}) {
    return (
        <p
            style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
            }}
        >
            {children}
        </p>
    );
}

const card = {
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 12,
    padding: '1rem 1.25rem',
    marginBottom: 14,
};

export default function Home() {
    const [tab, setTab] = useState('plan');
    const [notionKey, setNotionKey] = useState('');
    const [dbId, setDbId] = useState('');
    const [status, setStatus] = useState('idle');
    const [statusMsg, setStatusMsg] = useState('');
    const [logs, setLogs] = useState([]);
    const [logDate, setLogDate] = useState(
        new Date().toISOString().split('T')[0],
    );
    const [logWeight, setLogWeight] = useState('');
    const [logWorkout, setLogWorkout] = useState(false);
    const [logNotes, setLogNotes] = useState('');

    const apiCall = async (action, extra = {}) => {
        const res = await fetch('/api/notion', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                notionKey,
                databaseId: dbId,
                action,
                ...extra,
            }),
        });
        return res.json();
    };

    const handleTest = async () => {
        if (!notionKey || !dbId) return;
        setStatus('loading');
        setStatusMsg('连接中…');
        const data = await apiCall('test');
        if (data.ok) {
            setStatus('success');
            setStatusMsg(`已连接：${data.title}`);
        } else {
            setStatus('error');
            setStatusMsg(data.error || '连接失败');
        }
    };

    const handleLog = async () => {
        if (!logWeight) return;
        setStatus('loading');
        setStatusMsg('记录中…');
        const data = await apiCall('log', {
            entry: {
                date: logDate,
                weight: logWeight,
                workout: logWorkout,
                notes: logNotes,
            },
        });
        if (data.ok) {
            setStatus('success');
            setStatusMsg('记录成功！');
            setLogWeight('');
            setLogNotes('');
            fetchLogs();
        } else {
            setStatus('error');
            setStatusMsg(data.error || '记录失败');
        }
    };

    const fetchLogs = async () => {
        const data = await apiCall('fetch');
        if (data.ok) setLogs(data.rows);
    };

    useEffect(() => {
        if (tab === 'logs' && notionKey && dbId) fetchLogs();
    }, [tab]);

    return (
        <>
            <Head>
                <title>{planConfig.title}</title>
            </Head>
            <div
                style={{
                    maxWidth: 700,
                    margin: '0 auto',
                    padding: '2rem 1rem',
                    fontFamily: 'system-ui, sans-serif',
                    color: '#222',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <h1 style={{fontSize: 22, fontWeight: 500, margin: 0}}>
                            {planConfig.title}
                        </h1>
                        <p style={{fontSize: 13, color: '#888', marginTop: 4}}>
                            {planConfig.subtitle}
                        </p>
                    </div>
                    <span
                        style={{
                            background: '#EAF3DE',
                            color: '#3B6D11',
                            borderRadius: 8,
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                    >
                        第{planConfig.currentWeek}周 / 共{planConfig.totalWeeks}
                        周
                    </span>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: 'flex',
                        gap: 4,
                        marginBottom: '1.5rem',
                        background: '#f5f5f5',
                        borderRadius: 10,
                        padding: 4,
                    }}
                >
                    {[
                        ['plan', '📋 计划总览'],
                        ['notion', '🔗 Notion 同步'],
                        ['logs', '📊 数据记录'],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            style={{
                                flex: 1,
                                padding: '7px 0',
                                fontSize: 13,
                                fontWeight: tab === key ? 500 : 400,
                                borderRadius: 8,
                                border: 'none',
                                background:
                                    tab === key ? '#fff' : 'transparent',
                                cursor: 'pointer',
                                borderBottom:
                                    tab === key
                                        ? '2px solid #1D9E75'
                                        : '2px solid transparent',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* PLAN TAB */}
                {tab === 'plan' && (
                    <>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit,minmax(140px,1fr))',
                                gap: 10,
                                marginBottom: 14,
                            }}
                        >
                            {stats.map(({label, value}) => (
                                <div
                                    key={label}
                                    style={{
                                        background: '#f8f8f8',
                                        borderRadius: 8,
                                        padding: '1rem',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: '#888',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {label}
                                    </p>
                                    <p style={{fontSize: 20, fontWeight: 500}}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={card}>
                            <SectionLabel>整体进度</SectionLabel>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 13,
                                    color: '#888',
                                    marginBottom: 8,
                                }}
                            >
                                <span>已减重 {progress.lost}</span>
                                <span>还需减重 {progress.remaining}</span>
                            </div>
                            <Bar pct={progress.percentage} color='#1D9E75' />
                            <p
                                style={{
                                    fontSize: 11,
                                    color: '#888',
                                    marginTop: 6,
                                }}
                            >
                                已完成 {progress.percentage}%
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 14,
                            }}
                        >
                            <div style={card}>
                                <SectionLabel>本周锻炼安排</SectionLabel>
                                {schedule.map(({day, type, tag}, i) => (
                                    <div
                                        key={day}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            background:
                                                i % 2 === 0
                                                    ? '#f8f8f8'
                                                    : 'transparent',
                                            marginBottom: 4,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {day}
                                        </span>
                                        <span
                                            style={{
                                                ...tagStyle[tag],
                                                fontSize: 11,
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                            }}
                                        >
                                            {type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div style={card}>
                                <SectionLabel>每日营养目标</SectionLabel>
                                {nutrition.map(({label, value, pct, color}) => (
                                    <div key={label} style={{marginBottom: 12}}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 13,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <span>{label}</span>
                                            <span style={{fontWeight: 500}}>
                                                {value}
                                            </span>
                                        </div>
                                        <Bar pct={pct} color={color} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={card}>
                            <SectionLabel>阶段概览</SectionLabel>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: 10,
                                }}
                            >
                                {phases.map((p) => (
                                    <div
                                        key={p.label}
                                        style={{
                                            borderLeft: `3px solid ${p.color}`,
                                            paddingLeft: 10,
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                color: p.dark,
                                            }}
                                        >
                                            {p.label} — {p.weeks}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 12,
                                                color: '#888',
                                                marginTop: 3,
                                            }}
                                        >
                                            {p.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={card}>
                            <SectionLabel>本周小贴士</SectionLabel>
                            {tips.map(({color, text}, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        gap: 8,
                                        alignItems: 'flex-start',
                                        fontSize: 13,
                                        color: '#666',
                                        marginBottom: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: color,
                                            marginTop: 5,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* NOTION TAB */}
                {tab === 'notion' && (
                    <>
                        <div style={card}>
                            <SectionLabel>连接 Notion</SectionLabel>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: '#888',
                                    marginBottom: 14,
                                }}
                            >
                                前往{' '}
                                <a
                                    href='https://www.notion.so/my-integrations'
                                    target='_blank'
                                    rel='noreferrer'
                                    style={{color: '#1D9E75'}}
                                >
                                    notion.so/my-integrations
                                </a>{' '}
                                创建 Integration，然后在 Notion 数据库页面点击
                                ··· → 连接到 → 选择你的 Integration。
                            </p>
                            <label
                                style={{
                                    fontSize: 12,
                                    color: '#666',
                                    display: 'block',
                                    marginBottom: 4,
                                }}
                            >
                                Integration Secret Key
                            </label>
                            <input
                                type='password'
                                value={notionKey}
                                onChange={(e) => setNotionKey(e.target.value)}
                                placeholder='secret_xxxxxxxxxxxxxxxxxxxx'
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontFamily: 'monospace',
                                    marginBottom: 10,
                                    boxSizing: 'border-box',
                                }}
                            />
                            <label
                                style={{
                                    fontSize: 12,
                                    color: '#666',
                                    display: 'block',
                                    marginBottom: 4,
                                }}
                            >
                                数据库 ID（Database ID）
                            </label>
                            <input
                                type='text'
                                value={dbId}
                                onChange={(e) => setDbId(e.target.value)}
                                placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontFamily: 'monospace',
                                    marginBottom: 14,
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button
                                onClick={handleTest}
                                style={{
                                    width: '100%',
                                    padding: '9px 0',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    background: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                测试连接
                            </button>
                            {status !== 'idle' && (
                                <p
                                    style={{
                                        marginTop: 10,
                                        fontSize: 13,
                                        color:
                                            status === 'success'
                                                ? '#0F6E56'
                                                : status === 'error'
                                                  ? '#A32D2D'
                                                  : '#888',
                                        textAlign: 'center',
                                    }}
                                >
                                    {statusMsg}
                                </p>
                            )}
                        </div>

                        <div style={card}>
                            <SectionLabel>Notion 数据库字段要求</SectionLabel>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: '#888',
                                    marginBottom: 10,
                                }}
                            >
                                请在你的 Notion
                                数据库中创建以下字段（名称必须完全一致）：
                            </p>
                            {[
                                ['日期', 'Date 类型'],
                                ['体重 (kg)', 'Number 类型'],
                                ['完成锻炼', 'Checkbox 类型'],
                                ['备注', 'Text 类型'],
                            ].map(([name, type]) => (
                                <div
                                    key={name}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        padding: '6px 0',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'monospace',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {name}
                                    </span>
                                    <span style={{color: '#888'}}>{type}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* LOGS TAB */}
                {tab === 'logs' && (
                    <>
                        <div style={card}>
                            <SectionLabel>记录今日数据</SectionLabel>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 10,
                                    marginBottom: 10,
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: 12,
                                            color: '#666',
                                            display: 'block',
                                            marginBottom: 4,
                                        }}
                                    >
                                        日期
                                    </label>
                                    <input
                                        type='date'
                                        value={logDate}
                                        onChange={(e) =>
                                            setLogDate(e.target.value)
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: 8,
                                            fontSize: 13,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: 12,
                                            color: '#666',
                                            display: 'block',
                                            marginBottom: 4,
                                        }}
                                    >
                                        体重 (kg)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.1'
                                        value={logWeight}
                                        onChange={(e) =>
                                            setLogWeight(e.target.value)
                                        }
                                        placeholder='87.1'
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: 8,
                                            fontSize: 13,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            </div>
                            <label
                                style={{
                                    fontSize: 12,
                                    color: '#666',
                                    display: 'block',
                                    marginBottom: 4,
                                }}
                            >
                                备注（可选）
                            </label>
                            <input
                                type='text'
                                value={logNotes}
                                onChange={(e) => setLogNotes(e.target.value)}
                                placeholder='今天状态不错…'
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    marginBottom: 10,
                                    boxSizing: 'border-box',
                                }}
                            />
                            <label
                                style={{
                                    fontSize: 13,
                                    color: '#444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 14,
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type='checkbox'
                                    checked={logWorkout}
                                    onChange={(e) =>
                                        setLogWorkout(e.target.checked)
                                    }
                                />{' '}
                                今日完成锻炼
                            </label>
                            <button
                                onClick={handleLog}
                                style={{
                                    width: '100%',
                                    padding: '9px 0',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    border: '1px solid #1D9E75',
                                    borderRadius: 8,
                                    background: '#E1F5EE',
                                    color: '#0F6E56',
                                    cursor: 'pointer',
                                }}
                            >
                                同步到 Notion →
                            </button>
                            {status !== 'idle' && (
                                <p
                                    style={{
                                        marginTop: 10,
                                        fontSize: 13,
                                        color:
                                            status === 'success'
                                                ? '#0F6E56'
                                                : status === 'error'
                                                  ? '#A32D2D'
                                                  : '#888',
                                        textAlign: 'center',
                                    }}
                                >
                                    {statusMsg}
                                </p>
                            )}
                        </div>

                        <div style={card}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                }}
                            >
                                <SectionLabel>
                                    历史记录（最近12条）
                                </SectionLabel>
                                <button
                                    onClick={fetchLogs}
                                    style={{
                                        fontSize: 12,
                                        color: '#1D9E75',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    刷新
                                </button>
                            </div>
                            {logs.length === 0 ? (
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: '#aaa',
                                        textAlign: 'center',
                                        padding: '1rem 0',
                                    }}
                                >
                                    暂无记录，请先同步数据。
                                </p>
                            ) : (
                                logs.map((row, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f0f0f0',
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{color: '#888'}}>
                                            {row.date}
                                        </span>
                                        <span style={{fontWeight: 500}}>
                                            {row.weight} kg
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                background: row.workout
                                                    ? '#E1F5EE'
                                                    : '#f5f5f5',
                                                color: row.workout
                                                    ? '#0F6E56'
                                                    : '#888',
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                            }}
                                        >
                                            {row.workout ? '已锻炼' : '未锻炼'}
                                        </span>
                                        <span
                                            style={{
                                                color: '#aaa',
                                                maxWidth: 120,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {row.notes || '—'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
