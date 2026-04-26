using Microsoft.EntityFrameworkCore;
using PublicityHub.Domain.Entities;

namespace PublicityHub.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<JobAssignment> JobAssignments => Set<JobAssignment>();
    public DbSet<Proof> Proofs => Set<Proof>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // USERS
        // =========================
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Role).HasColumnName("role");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.PhoneNumber).IsUnique();
        });

        // =========================
        // CAMPAIGNS
        // =========================
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.ToTable("campaigns");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Location).HasColumnName("location");
            entity.Property(e => e.Amount).HasColumnName("amount");

            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            // 🔥 Relationship: Campaign → User
            entity.HasOne(e => e.CreatedByUser)
                  .WithMany(u => u.Campaigns)
                  .HasForeignKey(e => e.CreatedBy)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // =========================
        // JOB ASSIGNMENTS
        // =========================
        modelBuilder.Entity<JobAssignment>(entity =>
        {
            entity.ToTable("job_assignments");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.WorkerId).HasColumnName("worker_id");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.AcceptedAt).HasColumnName("accepted_at");
            entity.Property(e => e.CompletedAt).HasColumnName("completed_at");

            entity.Property(e => e.Status)
                  .HasDefaultValue("accepted");

            // Campaign relation
            entity.HasOne(e => e.Campaign)
                  .WithMany(c => c.JobAssignments)
                  .HasForeignKey(e => e.CampaignId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Worker relation
            entity.HasOne(e => e.Worker)
                  .WithMany(u => u.JobAssignments)
                  .HasForeignKey(e => e.WorkerId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.CampaignId, e.WorkerId })
                  .IsUnique();
        });

        // =========================
        // PROOFS
        // =========================
        modelBuilder.Entity<Proof>(entity =>
        {
            entity.ToTable("proofs");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AssignmentId).HasColumnName("assignment_id");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UploadedAt).HasColumnName("uploaded_at");
            entity.Property(e => e.ReviewedAt).HasColumnName("reviewed_at");

            entity.Property(e => e.Status)
                  .HasDefaultValue("pending");

            entity.HasOne(e => e.JobAssignment)
                  .WithOne(j => j.Proof)
                  .HasForeignKey<Proof>(e => e.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}